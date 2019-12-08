/**
 *  s3/upload_document.js
 *
 *  David Janes
 *  IOTDB
 *  2017-01-18
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const AWS = require("aws-sdk");
const mime = require("mime");
mime.getType = mime.getType || mime.lookup; // 2.0.3 vs 1.6.0 

/**
 *  Accepts: 
 *  Produces:
 */
const upload_document = _.promise((self, done) => {
    assert.ok(self.s3, `${method}: self.s3 is required`);
    assert.ok(_.is.String(self.bucket), `${method}: self.bucket must be a String`);
    assert.ok(_.is.String(self.key), `${method}: self.key must be a String`);
    assert.ok(_.is.String(self.document) || _.is.Buffer(self.document), `${method}: self.document must be a String or Buffer`);
    assert.ok(_.is.String(self.document_media_type) || !self.document_media_type, `${method}: self.document_media_type must be a String or Null`);
    assert.ok(_.is.String(self.document_encoding) || !self.document_encoding, `${method}: self.document_encoding must be a String or Null`);
    
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
    
    self.s3.upload(paramd, (error, data) => {
        if (error) {
            return done(error);
        }

        done(null, self);
    });
})

upload_document.method = "s3.upload_document"
upload_document.description = ``
upload_document.requires = {
    s3: _.is.Object,
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
exports.upload_document = _.promise.denodeify(upload_document);
