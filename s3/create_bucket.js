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
const Q = require("q");

/**
 *  Accepts: 
 *  Produces:
 */
const create_bucket = (_self, done) => {
   const self = _.d.clone.shallow(_self);

    assert.ok(self.s3, "s3.create_bucket: self.s3 is required");
    assert.ok(_.is.String(self.bucket), "s3.create_bucket: self.bucket must be a String");

    self.s3.createBucket({
        Bucket: "consensas-test1",
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        self.bucket_location = data.Location;
        self.aws.result = data;

        done(null, self);
    });
}

/**
 *  API
 */
exports.create_bucket = Q.denodeify(create_bucket);
