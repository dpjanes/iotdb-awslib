/**
 *  s3/bucket_exists.js
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

/**
 *  Accepts: 
 *  Produces:
 */
const bucket_exists = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "s3.bucket_exists";

    assert.ok(self.s3, `${method}: self.s3 is required`);
    assert.ok(_.is.String(self.bucket), `${method}: self.bucket must be a String`);

    self.s3.getBucketLocation({
        Bucket: self.bucket,
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
exports.bucket_exists = _.promise.denodeify(bucket_exists);
