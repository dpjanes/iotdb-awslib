/**
 *  s3/head_object.js
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

const normalize_path = require("../helpers/normalize_path");

/**
 *  Accepts: 
 *  Produces:
 */
const head_object = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "s3.head_object";

    assert.ok(self.s3, `${method}: self.s3 is required`);
    assert.ok(_.is.String(self.bucket), `${method}: self.bucket must be a String`);
    assert.ok(_.is.String(self.path) || !self.path, `${method}: self.path must be a String or Null`);

    self.s3.headObject({
        Bucket: self.bucket,
        Key: normalize_path(self.path),
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        self.aws.result = data;

        if (data.ContentType) {
            self.media_type = data.ContentType;
        }

        done(null, self);
    });
}

/**
 *  API
 */
exports.head_object = Q.denodeify(head_object);
