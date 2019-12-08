/**
 *  s3/delete_bucket.js
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
const delete_bucket = _.promise((self, done) => {
    _.promise.validate(self, delete_bucket)

    logger.warn({
        method: delete_bucket.method,
        bucket: self.bucket,
    }, "delete bucket")

    self.aws$s3.deleteBucket({
        Bucket: self.bucket,
    }, (error, data) => {
        self.aws$result = data

        if (!error) {
            logger.info({
                method: delete_bucket.method,
                bucket: self.bucket,
            }, "deleted bucket")

            return done(null, self)
        }

        if (error.statusCode === 404) {
            logger.warn({
                method: delete_bucket.method,
                bucket: self.bucket,
            }, "bucket already deleted")

            return done(null, self)
        }

        logger.error({
            method: delete_bucket.method,
            bucket: self.bucket,
            error: _.error.message(error),
        }, "cannot delete bucket")

        return done(error)
    })
})

delete_bucket.method = "s3.delete_bucket"
delete_bucket.description = `
    Delete a Bucket. If the Bucket does not exist, no error will be reported.`
delete_bucket.requires = {
    aws$s3: _.is.Object,
    bucket: _.is.String,
}
delete_bucket.accepts = {
}
delete_bucket.produces = {
    aws$result: _.is.Object,
}
delete_bucket.params = {
}
delete_bucket.p = _.p(delete_bucket)

/**
 *  API
 */
exports.delete_bucket = delete_bucket
