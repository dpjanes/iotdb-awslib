/**
 *  s3/get_object.js
 *
 *  David Janes
 *  IOTDB
 *  2017-01-19
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const AWS = require("aws-sdk");
const Q = require("q");

/**
 *  Accepts: 
 *  Produces:
 */
const get_object = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "s3.get_object";

    assert.ok(self.s3, `${method}: self.s3 is required`);
    assert.ok(_.is.String(self.bucket), `${method}: self.bucket must be a String`);
    assert.ok(_.is.String(self.key) || !self.key, `${method}: self.key must be a String or Null`);

    self.s3.getObject({
        Bucket: self.bucket,
        Key: self.key,
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        self.aws_result = data;

        if (_.is.String(data.Body)) {
            self.document = data.Body;
        } else if (_.is.Buffer(data.Body)) {
            self.document = data.Body.toString(data.ContentEncoding);
        } else {
            assert(false, `${method}: don't know how to deal with Body of type: ${typeof data.Body}`);
        }

        assert(self.document, `${method}: self.document should have been produced by now`);

        if (data.ContentType) {
            self.document_media_type = data.ContentType;
        }

        done(null, self);
    });
}

/**
 *  API
 */
exports.get_object = Q.denodeify(get_object);
