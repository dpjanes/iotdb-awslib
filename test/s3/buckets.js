/**
 *  buckets.js
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

const Q = require("q");

const aws = require("../../index");
const awsd = {}

describe("s3", function() {
    this.timeout(10 * 1000);

    describe("create_bucket / bucket_exists / delete_bucket (with duplicate calls)", function() {
        const bucket_name = "iotdb-awslib-" + _.id.uuid.v4();
        it("works", function(done) {
            Q({
                aws: awsd,
                bucket: bucket_name,
            })
                .then(aws.initialize)
                .then(aws.s3.initialize)
                .then(aws.s3.create_bucket)
                .then(aws.s3.create_bucket)
                .then(aws.s3.bucket_exists)
                .then(aws.s3.delete_bucket)
                .then(aws.s3.delete_bucket)
                .then(inner_self => {
                    assert.deepEqual(inner_self.bucket_url, `s3://${bucket_name}/`)
                    assert.deepEqual(inner_self.exists, true);
                    done(null);
                })
                .catch(done);
        });
    })
})
