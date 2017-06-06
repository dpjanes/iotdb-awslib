/**
 *  s3/create_bucket.js
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
const Q = require("bluebird-q");

/**
 *  Accepts: 
 *  Produces:
 */
const create_bucket = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "s3.create_bucket";

    assert.ok(self.s3, `${method}: self.s3 is required`);
    assert.ok(_.is.String(self.bucket), `${method}: self.bucket must be a String`);

    self.s3.createBucket({
        Bucket: self.bucket,
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        self.bucket_url = `s3:/${data.Location}/`;
        self.aws_result = data;

        done(null, self);
    });
}

/**
 *  API
 */
exports.create_bucket = Q.denodeify(create_bucket);
