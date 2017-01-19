/**
 *  s3/upload_document.js
 *
 *  David Janes
 *  IOTDB
 *  2017-01-18
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const AWS = require("aws-sdk");
const Q = require("q");
const mime = require("mime");

/**
 *  Accepts: 
 *  Produces:
 */
const upload_document = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "s3.upload_document";

    assert.ok(self.s3, `${method}: self.s3 is required`);
    assert.ok(_.is.String(self.bucket), `${method}: self.bucket must be a String`);
    assert.ok(_.is.String(self.key), `${method}: self.key must be a String`);
    assert.ok(_.is.String(self.media_type) || !self.media_type, `${method}: self.media_type must be a String or Null`);
    assert.ok(_.is.String(self.document) || _.is.Buffer(self.document), `${method}: self.document must be a String or Buffer`);

    self.s3.upload({
        Bucket: self.bucket,
        Key: self.key,
        Body: self.document,
        ContentType: self.media_type || mime.lookup(self.key) || "application/octet-stream",
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        done(null, self);
    });
}

/**
 *  API
 */
exports.upload_document = Q.denodeify(upload_document);
