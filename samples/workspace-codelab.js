// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

// [START_EXCLUDE]
// Instructions for this codelab can be found on this page
// https://cloud.google.com/channel/docs/codelabs/workspace/provisioning
// [END_EXCLUDE]

// [START credentials]
const {JWT} = require('google-auth-library');
const {grpc} = require('google-gax');
const {CloudChannelServiceClient} = require('@google-cloud/channel');

// ############## REPLACE WITH YOUR OWN VALUES ####################
const jsonPrivateKeyFile = 'path/to/json_key_file.json';
const resellerAdminUser = 'admin@yourresellerdomain.com';
const accountId = 'C012345';
const customerDomain = 'example.com';
// ################################################################
const accountName = `accounts/${accountId}`;

// create the API client with user impersonation
const authClient = new JWT({
  keyFile: jsonPrivateKeyFile,
  scopes: [ 'https://www.googleapis.com/auth/apps.order' ],
  subject: resellerAdminUser,
});
const sslCreds = grpc.credentials.combineChannelCredentials(
  grpc.credentials.createSsl(),
  grpc.credentials.createFromGoogleCredential(authClient)
);
const channelClient = new CloudChannelServiceClient({ sslCreds });
// [END credentials]

async function main() {
  // [START pickOffer]
  const [offers] = await channelClient.listOffers({
    parent: accountName
  });
  
  // For the purpose of this codelab, the code lists all offers and picks
  // the first offer for Google Workspace Business Standard on an Annual
  // plan. This is needed because offerIds vary from one account to another,
  // but this is not a recommended model for your production integration

  const filteredOffers = offers.filter(offer => {
    return offer.sku.marketingInfo.displayName === 'Google Workspace Business Standard'
          && offer.plan.paymentPlan === 'COMMITMENT';
  });

  const offer = filteredOffers[0];
  console.log(offer);
  // [END pickOffer]

  // [START checkExists]
  // Determine if customer already has a cloud identity
  const [cloudIdentityAccounts] = await channelClient.checkCloudIdentityAccountsExist({
    parent: accountName,
    domain: customerDomain
  });
  // checkCloudIdentityAccountsExist always returns an array
  if (cloudIdentityAccounts.length > 0) {
    throw new Error('Cloud identity already exists; ' +
                      'customer must be transferred ' +
                      '[out-of-scope of this codelab]');
  }
  // [END checkExists]

  // [START createCustomer]
  // Create the Customer resource
  const [customer] = await channelClient.createCustomer({
    parent: accountName,
    customer: {
      orgDisplayName: 'Acme Corp',
      orgPostalAddress: {
        addressLines: [
          '123 Main St'
        ],
        postalCode: '10009',
        regionCode: 'US'
      },
      domain: customerDomain,
      // Distributors need to pass the following value
      // channelPartnerId: channelPartnerLinkId
    }
  });
  console.log('Created customer:');
  console.info(customer);
  // [END createCustomer]

  // [START provisionCloudIdentity]
  // This endpoint returns a long-runng operation.
  // For other ways to get operation results, see
  // https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#long-running-operations
  const [cloudIdentityOp] = await channelClient.provisionCloudIdentity({
    customer: customer.name,
    cloudIdentityInfo: {
      alternateEmail: 'marty.mcfly@gmail.com',
      languageCode: 'en-US',
    },
    user: {
      givenName: 'Marty',
      familyName: 'McFly',
      email: `admin@${customerDomain}`,
    }
  },);
  
  await cloudIdentityOp.promise();
  console.log('Provisioned cloud identity');
  // [END provisionCloudIdentity]

  // [START createEntitlement]
  const [entitlementOp] = await channelClient.createEntitlement({
    parent: customer.name,
    entitlement: {
      offer: offer.name,
      parameters: [
        // Setting 5 seats for this Annual offer
        {
          name: 'num_units',
          value: {
            int64Value: 5
          }
        }
      ],
      commitmentSettings: {
        // Setting renewal settings to auto renew
        renewalSettings: {
          enableRenewal: true,
          paymentPlan: 'COMMITMENT',
          paymentCycle: {
            duration: 1,
            periodType: 'YEAR'
          }
        }
      },
      // A string of up to 80 characters.
      // As a best practice, we recommend an internal transaction ID or
      // identifier for this customer in this field.
      purchaseOrderId: 'A codelab test'
    }
  });

  const [entitlement] = await entitlementOp.promise();
  console.log('Created entitlement');
  console.info(entitlement);
  // [END createEntitlement]
};

main().catch(err => {
  console.error(err.message);
  process.exitCode = 1;
});
process.on('unhandledRejection', err => {
  console.error(err.message);
  process.exitCode = 1;
});
