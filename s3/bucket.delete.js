/**
 *  s3/bucket.delete.js
 *
 *  David Janes
 *  IOTDB
 *  2017-01-27
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

const logger = require("../logger")(__filename)

/**
 *  Accepts: 
 *  Produces:
 *
 */
const bucket = {}
bucket.delete = _.promise((self, done) => {
    _.promise.validate(self, bucket.delete)

    logger.warn({
        method: bucket.delete.method,
        bucket: self.bucket,
    }, "delete bucket")

    self.aws$s3.deleteBucket({
        Bucket: self.bucket,
    }, (error, data) => {
        self.aws$result = data

        if (!error) {
            logger.info({
                method: bucket.delete.method,
                bucket: self.bucket,
            }, "deleted bucket")

            return done(null, self)
        }

        if (error.statusCode === 404) {
            logger.warn({
                method: bucket.delete.method,
                bucket: self.bucket,
            }, "bucket already deleted")

            return done(null, self)
        }

        logger.error({
            method: bucket.delete.method,
            bucket: self.bucket,
            error: _.error.message(error),
        }, "cannot delete bucket")

        return done(error)
    })
})

bucket.delete.method = "s3.bucket.delete"
bucket.delete.description = `
    Delete a Bucket. If the Bucket does not exist, no error will be reported.`
bucket.delete.requires = {
    aws$s3: _.is.Object,
    bucket: _.is.String,
}
bucket.delete.accepts = {
}
bucket.delete.produces = {
    aws$result: _.is.Object,
}
bucket.delete.params = {
}
bucket.delete.p = _.p(bucket.delete)

/**
 *  API
 */
exports.bucket = bucket
