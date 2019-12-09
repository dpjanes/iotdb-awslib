/**
 *  object.list.js
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

describe("s3.object", function() {
    this.timeout(10 * 1000)

    it("xxx", function(done) {
        const bucket = awsd.bucket + _.random.id(6)

        _.promise.make({
            aws$cfg: awsd.aws$cfg,
            bucket: bucket,
        })
            .then(aws.initialize)
            .then(aws.s3.initialize)
            .then(aws.s3.bucket.create)
            .then(aws.s3.bucket.delete)
            .make(sd => {
            })
            .end(done)
    })
})
