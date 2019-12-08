/**
 *  s3/delete_bucket.js
 *
 *  David Janes
 *  IOTDB
 *  2017-01-27
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const AWS = require("aws-sdk");

const logger = require("../logger")(__filename);

/**
 *  Accepts: 
 *  Produces:
 *
 *  Delete a Bucket. If the Bucket does not exist,
 *  no error will be reported.
 */
const delete_bucket = _.promise((self, done) => {
    assert.ok(self.s3, `${method}: self.s3 is required`);
    assert.ok(_.is.String(self.bucket), `${method}: self.bucket must be a String`);

    logger.warn({
        method: method,
        bucket: self.bucket,
    }, "delete bucket");

    self.s3.deleteBucket({
        Bucket: self.bucket,
    }, (error, data) => {
        self.aws_result = data;

        if (!error) {
            logger.info({
                method: method,
                bucket: self.bucket,
            }, "deleted bucket")

            return done(null, self);
        }

        if (error.statusCode === 404) {
            logger.warn({
                method: method,
                bucket: self.bucket,
            }, "bucket already deleted")

            return done(null, self);
        }

        logger.error({
            method: method,
            bucket: self.bucket,
            error: _.error.message(error),
        }, "cannot delete bucket")

        return done(error);
    });
})

delete_bucket.method = "s3.delete_bucket"
delete_bucket.description = ``
delete_bucket.requires = {
    s3: _.is.Object,
}
delete_bucket.accepts = {
}
delete_bucket.produces = {
}
delete_bucket.params = {
}
delete_bucket.p = _.p(delete_bucket)

/**
 *  API
 */
exports.delete_bucket = delete_bucket
