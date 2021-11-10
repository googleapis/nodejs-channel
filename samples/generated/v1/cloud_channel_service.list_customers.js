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

function main(parent) {
  // [START cloudchannel_v1_generated_CloudChannelService_ListCustomers_async]
  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */
  /**
   *  Required. The resource name of the reseller account to list customers from.
   *  Parent uses the format: accounts/{account_id}.
   */
  // const parent = 'abc123'
  /**
   *  Optional. The maximum number of customers to return. The service may return fewer
   *  than this value. If unspecified, returns at most 10 customers. The
   *  maximum value is 50.
   */
  // const pageSize = 1234
  /**
   *  Optional. A token identifying a page of results other than the first page.
   *  Obtained through
   *  ListCustomersResponse.next_page_token google.cloud.channel.v1.ListCustomersResponse.next_page_token  of the previous
   *  CloudChannelService.ListCustomers google.cloud.channel.v1.CloudChannelService.ListCustomers  call.
   */
  // const pageToken = 'abc123'

  // Imports the Channel library
  const {CloudChannelServiceClient} = require('@google-cloud/channel').v1;

  // Instantiates a client
  const channelClient = new CloudChannelServiceClient();

  async function callListCustomers() {
    // Construct request
    const request = {
      parent,
    };

    // Run request
    const iterable = await channelClient.listCustomersAsync(request);
    for await (const response of iterable) {
      console.log(response);
    }
  }

  callListCustomers();
  // [END cloudchannel_v1_generated_CloudChannelService_ListCustomers_async]
}

process.on('unhandledRejection', err => {
  console.error(err.message);
  process.exitCode = 1;
});
main(...process.argv.slice(2));
