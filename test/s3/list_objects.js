/**
 *  list_objects.js
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
const awsd = {
    "profile": "consensas"
}

describe("s3", function() {
    this.timeout(10 * 1000);

    const bucket_name = "consensas-test1";

    describe("list_objects", function() {
        it("works", function(done) {
            Q({
                aws: awsd,
                bucket: bucket_name,
            })
                .then(aws.initialize)
                .then(aws.s3.initialize)
                .then(aws.s3.bucket_exists)
                .then(inner_self => {
                    assert.deepEqual(inner_self.exists, true);
                    done(null);
                })
                .catch(done);
        });
    })
})
