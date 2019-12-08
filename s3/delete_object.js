/**
 *  s3/delete_object.js
 *
 *  David Janes
 *  IOTDB
 *  2017-01-19
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
 */
const delete_object = _.promise.make((self, done) => {
    _.promise.validate(self, delete_object)

    logger.info({
        method: delete_object.method,
        bucket: self.bucket,
        key: self.key,
    }, "delete object")

    self.aws$s3.deleteObject({
        Bucket: self.bucket,
        Key: self.key,
    }, (error, data) => {
        if (error) {
            return done(error)
        }

        self.aws$result = data

        done(null, self)
    })
})

delete_object.method = "s3.delete_object"
delete_object.requires = {
    aws$s3: _.is.Object,
    bucket: _.is.String,
    key: _.is.String,
}
delete_object.produces = {
    aws$result: _.is.Object,
}

/**
 *  API
 */
exports.delete_object = delete_object
