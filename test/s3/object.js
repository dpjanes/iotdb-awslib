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

const bucket = awsd.bucket + _.random.id(6)

describe("s3.object", function() {
    this.timeout(10 * 1000)

    let self = {}

    before(function(done) {
        _.promise({
            aws$cfg: awsd.aws$cfg,
            bucket: bucket,
        })
            .then(aws.initialize)
            .then(aws.s3.initialize)
            .make(sd => {
                self = sd
            })
            .end(done)
    })

    beforeEach(function(done) {
        _.promise(self)
            .then(aws.s3.bucket.create)
            .end(done)
    })

    afterEach(function(done) {
        _.promise(self)
            .then(aws.s3.bucket.delete.objects.p())
            .then(aws.s3.bucket.delete)
            .end(done)
    })

    it("object.put - string", function(done) {
        const KEY = "something.txt"

        _.promise(self)
            .add("key", KEY)
            .add("document", "Hello, World")
            .then(aws.s3.object.put)
            .make(sd => {
                // console.log("xxx")
            })
            .end(done)
    })
})
