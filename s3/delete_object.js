/**
 *  s3/delete_object.js
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
const delete_object = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "s3.delete_object";

    assert.ok(self.s3, `${method}: self.s3 is required`);
    assert.ok(_.is.String(self.bucket), `${method}: self.bucket must be a String`);
    assert.ok(_.is.String(self.key) || !self.key, `${method}: self.key must be a String or Null`);

    self.s3.deleteObject({
        Bucket: self.bucket,
        Key: self.key,
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
exports.delete_object = Q.denodeify(delete_object);