/**
 *  s3/get_object.js
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

const assert = require("assert")

/**
 */
const get_object = _.promise((self, done) => {
    _.promise.validate(self, get_object)

    self.aws$s3.getObject({
        Bucket: self.bucket,
        Key: self.key,
    }, (error, data) => {
        if (error) {
            return done(error)
        }

        self.aws_result = data

        if (_.is.String(data.Body)) {
            self.document = data.Body

            if (data.ContentEncoding) {
                self.document_encoding = data.ContentEncoding
            }
        } else if (_.is.Buffer(data.Body)) {
            if (data.ContentEncoding) {
                self.document = data.Body.toString(data.ContentEncoding)
                self.document_encoding = data.ContentEncoding
            } else {
                self.document = data.Body
                self.document_encoding = null
            }
        } else {
            assert.ok(false, `${get_object.method}: don't know how to deal with Body of type: ${typeof data.Body}`)
        }

        assert.ok(self.document, `${get_object.method}: self.document should have been produced by now`)

        if (data.ContentType) {
            self.document_media_type = data.ContentType
        }

        done(null, self)
    })
})
get_object.method = "s3.get_object"
get_object.requires = {
    aws$s3: _.is.Object,
    bucket: _.is.String,
    key: _.is.String,
}

/**
 *  API
 */
exports.get_object = get_object

