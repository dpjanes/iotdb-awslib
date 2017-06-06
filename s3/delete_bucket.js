/**
 *  s3/delete_bucket.js
 *
 *  David Janes
 *  IOTDB
 *  2017-01-27
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const AWS = require("aws-sdk");
const Q = require("bluebird-q");

const logger = require("../logger")(__filename);

/**
 *  Accepts: 
 *  Produces:
 *
 *  Delete a Bucket. If the Bucket does not exist,
 *  no error will be reported.
 */
const delete_bucket = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "s3.delete_bucket";

    assert.ok(self.s3, `${method}: self.s3 is required`);
    assert.ok(_.is.String(self.bucket), `${method}: self.bucket must be a String`);

    logger.warn({
        method: method,
        bucket: self.bucket,
    }, "DELETE BUCKET");

    self.s3.deleteBucket({
        Bucket: self.bucket,
    }, (error, data) => {
        self.aws_result = data;

        if (!error) {
            console.log("-", method, "deleted bucket:", self.bucket);
            return done(null, self);
        }

        if (error.statusCode === 404) {
            console.log("-", method, "bucket already deleted:", self.bucket);
            return done(null, self);
        }

        console.log("#", method, "cannot delete bucket:", self.bucket, _.error.message(error));
        return done(error);
    });
}

/**
 *  API
 */
exports.delete_bucket = Q.denodeify(delete_bucket);
