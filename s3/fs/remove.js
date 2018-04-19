/**
 *  s3/remove.js
 *
 *  David Janes
 *  IOTDB
 *  2018-04-19
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict";

const _ = require("iotdb-helpers")

const assert = require("assert")

const AWS = require("aws-sdk")

/**
 */
const remove = _.promise.make((self, done) => {
    const method = "aws.s3.fs.remove"
    const aws = require("../..")

    assert.ok(_.is.String(self.path), `${method}: self.path must be String`)

    _.promise.make(self)
        .then(aws.s3.parse_path)
        .then(aws.s3.delete_object)
        .then(_.promise.done(done, self))
        .catch(done)
})

/**
 */
const remove_recursive = _.promise.make((self, done) => {
    const method = "aws.s3.fs.remove.recursive"
    const aws = require("../..")

    assert.ok(_.is.String(self.path), `${method}: self.path must be String`)

    _.promise.make(self)
        .then(aws.s3.parse_path)
        .then(aws.s3.delete_bucket_objects)
        .then(_.promise.done(done, self))
        .catch(done)
})

/**
 *  API
 */
exports.remove = remove
exports.remove.recursive = remove_recursive
exports.remove.breadth_first = remove_recursive
exports.remove.depth_first = () => { throw new Error("aws.s3.fs.remove.depth_first not implemented") }

