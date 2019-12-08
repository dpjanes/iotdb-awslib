/**
 *  s3/object.exists.js
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
const object = {}
object.exists = _.promise.make((self, done) => {
    _.promise.validate(self, object.exists)

    self.aws$s3.headObject({
        Bucket: self.bucket,
        Key: self.key,
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
})

object.exists.method = "s3.object.exists"
object.exists.requires = {
    aws$s3: _.is.Object,
    bucket: _.is.String,
    key: _.is.String,
}
object.exists.accepts = {
}
object.exists.produces = {
    aws$result: _.is.Object,
    exists: _.is.Boolean,
}

/**
 *  API
 */
exports.object = object
