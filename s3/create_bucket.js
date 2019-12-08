/**
 *  s3/create_bucket.js
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
const create_bucket = _.promise((self, done) => {
    assert.ok(self.s3, `${method}: self.s3 is required`);
    assert.ok(_.is.String(self.bucket), `${method}: self.bucket must be a String`);

    self.s3.createBucket({
        Bucket: self.bucket,
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        self.bucket_url = `s3:/${data.Location}/`;
        self.aws_result = data;

        done(null, self);
    });
})

create_bucket.method = "s3.create_bucket"
create_bucket.description = ``
create_bucket.requires = {
    s3: _.is.Object,
}
create_bucket.accepts = {
}
create_bucket.produces = {
}
create_bucket.params = {
}
create_bucket.p = _.p(create_bucket)

/**
 *  API
 */
exports.create_bucket = _.promise.denodeify(create_bucket);
