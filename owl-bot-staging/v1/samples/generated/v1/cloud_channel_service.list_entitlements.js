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
  // [START channel_v1_generated_CloudChannelService_ListEntitlements_async]
  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */
  /**
   *  Required. The resource name of the reseller's customer account to list
   *  entitlements for.
   *  Parent uses the format: accounts/{account_id}/customers/{customer_id}
   */
  // const parent = 'abc123'
  /**
   *  Optional. Requested page size. Server might return fewer results than requested.
   *  If unspecified, return at most 50 entitlements.
   *  The maximum value is 100; the server will coerce values above 100.
   */
  // const pageSize = 1234
  /**
   *  Optional. A token for a page of results other than the first page.
   *  Obtained using
   *  [ListEntitlementsResponse.next_page_token][google.cloud.channel.v1.ListEntitlementsResponse.next_page_token] of the previous
   *  [CloudChannelService.ListEntitlements][google.cloud.channel.v1.CloudChannelService.ListEntitlements] call.
   */
  // const pageToken = 'abc123'

  // Imports the Channel library
  const {CloudChannelServiceClient} = require('@google-cloud/channel').v1;

  // Instantiates a client
  const channelClient = new CloudChannelServiceClient();

  async function listEntitlements() {
    // Construct request
    const request = {
      parent,
    };

    // Run request
    const iterable = await channelClient.listEntitlementsAsync(request);
    for await (const response of iterable) {
        console.log(response);
    }
  }

  listEntitlements();
  // [END channel_v1_generated_CloudChannelService_ListEntitlements_async]
}

process.on('unhandledRejection', err => {
  console.error(err.message);
  process.exitCode = 1;
});
main(...process.argv.slice(2));
