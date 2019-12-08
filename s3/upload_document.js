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

const mime = require("mime")
mime.getType = mime.getType || mime.lookup; // 2.0.3 vs 1.6.0 

/**
 */
const upload_document = _.promise((self, done) => {
    _.promise.validate(self, upload_document)

    const paramd = {
        Bucket: self.bucket,
        Key: self.key,
        Body: self.document,
        ContentType: self.document_media_type || mime.getType(self.key) || "application/octet-stream",
        ContentEncoding: self.document_encoding || null,
    }

    if (self.aws$acl) {
        paramd.ACL = self.aws$acl
    } else if (self.aws$acl_public) {
        paramd.ACL = "public-read"
    }
    
    self.aws$s3.upload(paramd, (error, data) => {
        if (error) {
            return done(error)
        }

        self.aws$result = data

        done(null, self)
    })
})

upload_document.method = "s3.upload_document"
upload_document.description = ``
upload_document.requires = {
    aws$s3: _.is.Object,
    bucket: _.is.String,
    key: _.is.String,
    document: [ _.is.String, _.is.Buffer, ],
}
upload_document.accepts = {
    document_encoding: _.is.String,
    document_media_type: _.is.String,
    aws$acl_public: _.is.Boolean,
    aws$acl: _.is.String,
}
upload_document.produces = {
    aws$result: _.is.Object,
}

/**
 *  API
 */
exports.upload_document = upload_document
