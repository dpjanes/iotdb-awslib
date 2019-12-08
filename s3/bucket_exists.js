/**
 *  s3/bucket_exists.js
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

const assert = require("assert")

/**
 */
const bucket_exists = _.promise((self, done) => {
    _.promise.validate(self, bucket_exists)

    _.promise(self)
        .validate(bucket_exists)

        .make(sd => {
            sd.exists = true
            sd.param = {
                Bucket: self.bucket,
            }
        })
        .wrap(self.aws$s3.getBucketLocation.bind(self.aws$s3), "param", "data")
        .except(error => {
            if (error.statusCode === 404) {
                error.self.exists = false
                return error.self
            }

            throw error
        })

        .end(done, self, bucket_exists)

/*
    assert.ok(self.aws$s3, `${bucket_exists.method}: self.aws$s3 is required`)
    assert.ok(_.is.String(self.bucket), `${bucket_exists.method}: self.bucket must be a String`)

    self.aws$s3.getBucketLocation({
        Bucket: self.bucket,
    }, (error, data) => {
        if (!error) {
            self.exists = true
            return done(null, self)
        }

        if (error.statusCode === 404) {
            self.exists = false
            return done(null, self)
        }

        return done(error)
    })
*/
})

bucket_exists.method = "s3.bucket_exists"
bucket_exists.description = ``
bucket_exists.requires = {
    aws$s3: _.is.Object,
    bucket: _.is.String,
}
bucket_exists.produces = {
    exists: _.is.Boolean,
}
bucket_exists.params = {
    bucket: _.is.String,
}
bucket_exists.p = _.p(bucket_exists)

/**
 *  API
 */
exports.bucket_exists = bucket_exists
