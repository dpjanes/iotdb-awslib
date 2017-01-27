/**
 *  s3/object_exists.js
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

/**
 *  Accepts: 
 *  Produces:
 */
const object_exists = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "s3.object_exists";

    assert.ok(self.s3, `${method}: self.s3 is required`);
    assert.ok(_.is.String(self.bucket), `${method}: self.bucket must be a String`);
    assert.ok(_.is.String(self.key), `${method}: self.key must be a String`);

    self.s3.headObject({
        Bucket: self.bucket,
        Key: self.key,
    }, (error, data) => {
        if (!error) {
            self.exists = true;
            return done(null, self);
        }

        if (error.statusCode === 404) {
            self.exists = false;
            return done(null, self);
        }

        return done(error);
    });
}

/**
 *  API
 */
exports.object_exists = Q.denodeify(object_exists);
