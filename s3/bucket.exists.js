/**
 *  s3/bucket.exists.js
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
bucket.exists = _.promise((self, done) => {
    _.promise.validate(self, bucket.exists)

    _.promise(self)
        .validate(bucket.exists)

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

        .end(done, self, bucket.exists)

/*
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

bucket.exists.method = "s3.bucket.exists"
bucket.exists.description = ``
bucket.exists.requires = {
    aws$s3: _.is.Object,
    bucket: _.is.String,
}
bucket.exists.produces = {
    exists: _.is.Boolean,
}
bucket.exists.params = {
    bucket: _.is.String,
}
bucket.exists.p = _.p(bucket.exists)

/**
 *  API
 */
exports.bucket = bucket
