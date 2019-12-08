/**
 *  s3/upload_document.js
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

const mime = require("mime")
mime.getType = mime.getType || mime.lookup; // 2.0.3 vs 1.6.0 

/**
 *  Accepts: 
 *  Produces:
 */
const upload_document = _.promise((self, done) => {
    _.promise.validate(self, upload_document)

    assert.ok(self.aws$s3, `${method}: self.aws$s3 is required`)
    assert.ok(_.is.String(self.bucket), `${method}: self.bucket must be a String`)
    assert.ok(_.is.String(self.key), `${method}: self.key must be a String`)
    assert.ok(_.is.String(self.document) || _.is.Buffer(self.document), `${method}: self.document must be a String or Buffer`)
    assert.ok(_.is.String(self.document_media_type) || !self.document_media_type, `${method}: self.document_media_type must be a String or Null`)
    assert.ok(_.is.String(self.document_encoding) || !self.document_encoding, `${method}: self.document_encoding must be a String or Null`)
    
    const paramd = {
        Bucket: self.bucket,
        Key: self.key,
        Body: self.document,
        ContentType: self.document_media_type || mime.getType(self.key) || "application/octet-stream",
        ContentEncoding: self.document_encoding || null,
    }

    if (self.acl_public) {
        paramd.ACL = "public-read"
    }
    
    self.aws$s3.upload(paramd, (error, data) => {
        if (error) {
            return done(error)
        }

        done(null, self)
    })
})

upload_document.method = "s3.upload_document"
upload_document.description = ``
upload_document.requires = {
    aws$s3: _.is.Object,
}
upload_document.accepts = {
}
upload_document.produces = {
}
upload_document.params = {
}
upload_document.p = _.p(upload_document)

/**
 *  API
 */
exports.upload_document = upload_document
