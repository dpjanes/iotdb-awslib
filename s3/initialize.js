/**
 *  s3/initialize.js
 *
 *  David Janes
 *  IOTDB
 *  2017-01-18
 *
 *  Copyright (2013-2020) David P. Janes
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

"use strict";

const _ = require("iotdb-helpers");

const AWS = require("aws-sdk");

/**
 */
const initialize = _.promise(self => {
    _.promise.validate(self, initialize)

    self.s3 = new AWS.S3({
        apiVersion: '2006-03-01',
    });
})

initialize.method = "s3.initialize"
initialize.description = ``
initialize.requires = {
    AWS: _.is.Dictionary,
}
initialize.produces = {
    s3: _.is.Object,
}

/**
 *  API
 */
exports.initialize = _.promise.denodeify(initialize);
