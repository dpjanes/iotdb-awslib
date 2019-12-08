/**
 *  s3/list_buckets.js
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

const assert = require("assert");

const AWS = require("aws-sdk");

/**
 *  Accepts: 
 *  Produces:
 */
const list_buckets = _.promise((self, done) => {
    assert.ok(self.s3, `${method}: self.s3 is required`);

    self.s3.listBuckets({
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        self.buckets = data.Buckets.map(bd => bd.Name);
        self.aws_result = data;

        done(null, self);
    });
    
})

list_buckets.method = "s3.list_buckets"
list_buckets.description = ``
list_buckets.requires = {
    s3: _.is.Object,
}
list_buckets.accepts = {
}
list_buckets.produces = {
}
list_buckets.params = {
}
list_buckets.p = _.p(list_buckets)

/**
 *  API
 */
exports.list_buckets = _.promise.denodeify(list_buckets);
