/**
 *  s3/bucket.list.js
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
bucket.list = _.promise((self, done) => {
    _.promise.validate(self, bucket.list)

    self.aws$s3.listBuckets({
    }, (error, data) => {
        if (error) {
            return done(error)
        }

        self.buckets = data.Buckets.map(bd => bd.Name)
        self.aws$result = data

        done(null, self)
    })
    
})

bucket.list.method = "s3.bucket.list"
bucket.list.description = ``
bucket.list.requires = {
    aws$s3: _.is.Object,
}
bucket.list.produces = {
    aws$result: _.is.Object,
    buckets: _.is.Array.of.String,
}

/**
 *  API
 */
exports.bucket = bucket
