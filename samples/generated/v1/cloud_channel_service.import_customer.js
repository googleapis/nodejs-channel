// Copyright 2021 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

function main(domain, cloudIdentityId, parent, overwriteIfExists) {
  // [START channel_import_customer_sample]
  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */
  /**
   *  Required. Customer domain.
   */
  // const domain = 'abc123'
  /**
   *  Required. Customer's Cloud Identity ID
   */
  // const cloudIdentityId = 'abc123'
  /**
   *  Required. The resource name of the reseller's account.
   *  Parent takes the format: accounts/{account_id} or
   *  accounts/{account_id}/channelPartnerLinks/{channel_partner_id}
   */
  // const parent = 'abc123'
  /**
   *  Optional. The super admin of the resold customer generates this token to
   *  authorize a reseller to access their Cloud Identity and purchase
   *  entitlements on their behalf. You can omit this token after authorization.
   *  See https://support.google.com/a/answer/7643790 for more details.
   */
  // const authToken = 'abc123'
  /**
   *  Required. Choose to overwrite an existing customer if found.
   *  This must be set to true if there is an existing customer with a
   *  conflicting region code or domain.
   */
  // const overwriteIfExists = true
  /**
   *  Optional. Cloud Identity ID of a channel partner who will be the direct reseller for
   *  the customer's order. This field is required for 2-tier transfer scenarios
   *  and can be provided via the request Parent binding as well.
   */
  // const channelPartnerId = 'abc123'
  /**
   *  Optional. Specifies the customer that will receive imported Cloud Identity
   *  information.
   *  Format: accounts/{account_id}/customers/{customer_id}
   */
  // const customer = 'abc123'

  // Imports the Channel library
  const {CloudChannelServiceClient} = require('@google-cloud/channel').v1;

  // Instantiates a client
  const channelClient = new CloudChannelServiceClient();

  async function importCustomer() {
    // Construct request
    const request = {
      domain,
      cloudIdentityId,
      parent,
      overwriteIfExists,
    };

    // Run request
    const response = await channelClient.importCustomer(request);
    console.log(response);
  }

  importCustomer();
  // [END channel_import_customer_sample]
}

process.on('unhandledRejection', err => {
  console.error(err.message);
  process.exitCode = 1;
});
main(...process.argv.slice(2));
