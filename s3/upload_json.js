/**
 *  s3/upload_json.js
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

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const AWS = require("aws-sdk");

/**
 *  Accepts: 
 *  Produces:
 */
const upload_json = _.promise((self, done) => {
    assert.ok(self.s3, `${method}: self.s3 is required`);
    assert.ok(_.is.String(self.bucket), `${method}: self.bucket must be a String`);
    assert.ok(_.is.String(self.key), `${method}: self.key must be a String`);
    assert.ok(_.is.String(self.document_media_type) || !self.document_media_type, `${method}: self.document_media_type must be a String or Null`);
    assert.ok(_.is.JSON(self.json), `${method}: self.json must be a JSON document`);

    self.s3.upload({
        Bucket: self.bucket,
        Key: self.key,
        Body: JSON.stringify(self.json, null, 2),
        ContentType: self.document_media_type || "application/json",
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        done(null, self);
    });

    /*
    _.promise(self)
        .add("wrap$in", {
            Bucket: self.bucket,
            Key: self.key,
            Body: JSON.stringify(self.json, null, 2),
            ContentType: self.document_media_type || "application/json",
        })
        .wrap(s3.upload, "in")
    */
})

upload_json.method = "s3.upload_json"
upload_json.description = ``
upload_json.requires = {
    s3: _.is.Object,
}
upload_json.accepts = {
}
upload_json.produces = {
}
upload_json.params = {
}
upload_json.p = _.p(upload_json)

/**
 *  API
 */
exports.upload_json = _.promise.denodeify(upload_json);
