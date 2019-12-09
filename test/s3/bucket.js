/**
 *  buckets.js
 *
 *  David Janes
 *  IOTDB
 *  2017-01-27
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict"

const _ = require("iotdb-helpers")

const assert = require("assert")

const aws = require("../../index")
const awsd = require("./aws.json")

describe("s3.bucket", function() {
    this.timeout(10 * 1000)

    it("bucket.create / bucket.exists / bucket.delete (with duplicate calls)", function(done) {
        const bucket = awsd.bucket + _.random.id(6)

        _.promise.make({
            aws$cfg: awsd.aws$cfg,
            bucket: bucket,
        })
            .then(aws.initialize)
            .then(aws.s3.initialize)
            .then(aws.s3.bucket.create)
            .then(aws.s3.bucket.create)
            .then(aws.s3.bucket.exists)
            .then(aws.s3.bucket.delete)
            .then(aws.s3.bucket.delete)
            .make(sd => {
                assert.deepEqual(sd.bucket_url, `s3://${bucket}/`)
                assert.deepEqual(sd.exists, true)
            })
            .end(done)
    })
})
