/**
 *  s3/object.head.js
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
object.head = _.promise((self, done) => {
    _.promise.validate(self, object.head)

    self.aws$s3.headObject({
        Bucket: self.bucket,
        Key: self.key,
    }, (error, data) => {
        if (error) {
            return done(error)
        }

        self.aws$result = data

        if (data.ContentType) {
            self.document_media_type = data.ContentType
        }

        done(null, self)
    })
})

object.head.method = "s3.object.head"
object.head.description = ``
object.head.requires = {
    aws$s3: _.is.Object,
    bucket: _.is.String,
    key: _.is.String,
}
object.head.produces = {
    aws$result: _.is.Object,
    document_media_type: _.is.String,
}

/**
 *  API
 */
exports.object = object
