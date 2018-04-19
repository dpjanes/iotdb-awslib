/**
 *  s3/list.js
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
const list = _.promise.make((self, done) => {
    const method = "aws.s3.fs.list"
    const aws = require("../..")

    assert.ok(_.is.String(self.path), `${method}: self.path must be String`)

    _.promise.make(self)
        .then(aws.s3.parse_path)
        .then(aws.s3.list_objects)
        .then(_.promise.done(done, self, "paths"))
})

/**
 */
const list_recursive = _.promise.make((self, done) => {
    const method = "aws.s3.fs.list.recursive"
    const aws = require("../..")

    assert.ok(_.is.String(self.path), `${method}: self.path must be String`)

    _.promise.make(self)
        .then(_.promise.add("fails", []))
        .then(aws.s3.parse_path)
        .then(aws.s3.list_objects.recursive)
        .then(_.promise.done(done, self, "paths,fails"))
})

/**
 *  API
 */
exports.list = list
exports.list.recursive = list_recursive
exports.list.breadth_first = list_recursive
exports.list.depth_first = () => { throw new Error("aws.s3.fs.list.depth_first not implemented") }

