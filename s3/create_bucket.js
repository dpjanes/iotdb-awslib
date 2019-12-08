/**
 *  s3/create_bucket.js
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
const create_bucket = _.promise((self, done) => {
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
})

create_bucket.method = "s3.create_bucket"
create_bucket.description = ``
create_bucket.requires = {
    s3: _.is.Object,
}
create_bucket.accepts = {
}
create_bucket.produces = {
}
create_bucket.params = {
}
create_bucket.p = _.p(create_bucket)

/**
 *  API
 */
exports.create_bucket = _.promise.denodeify(create_bucket);
