/**
 *  s3/head_object.js
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

/**
 *  Accepts: 
 *  Produces:
 */
const head_object = _.promise((self, done) => {
    assert.ok(self.s3, `${method}: self.s3 is required`);
    assert.ok(_.is.String(self.bucket), `${method}: self.bucket must be a String`);
    assert.ok(_.is.String(self.key) || !self.key, `${method}: self.key must be a String or Null`);

    self.s3.headObject({
        Bucket: self.bucket,
        Key: self.key,
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        self.aws_result = data;

        if (data.ContentType) {
            self.document_media_type = data.ContentType;
        }

        done(null, self);
    });
})

head_object.method = "s3.head_object"
head_object.description = ``
head_object.requires = {
    s3: _.is.Object,
}
head_object.accepts = {
}
head_object.produces = {
}
head_object.params = {
}
head_object.p = _.p(head_object)

/**
 *  API
 */
exports.head_object = _.promise.denodeify(head_object);
