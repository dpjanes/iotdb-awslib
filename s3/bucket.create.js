/**
 *  s3/bucket.create.js
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

"use strict"

const _ = require("iotdb-helpers")

/**
 */
const bucket = {}
bucket.create = _.promise((self, done) => {
    _.promise.validate(self, bucket.create)

    self.aws$s3.createBucket({
        Bucket: self.bucket,
    }, (error, data) => {
        if (error) {
            return done(error)
        }

        self.bucket_url = `s3:/${data.Location}/`
        self.aws$result = data

        done(null, self)
    })
})

bucket.create.method = "s3.bucket.create"
bucket.create.description = ``
bucket.create.requires = {
    aws$s3: _.is.Object,
    bucket: _.is.String,
}
bucket.create.produces = {
    bucket_url: _.is.String,
    aws$result: _.is.Object,
}
bucket.create.params = {
    bucket: _.p.normal,
}
bucket.create.p = _.p(bucket.create)

/**
 *  API
 */
exports.bucket = bucket
