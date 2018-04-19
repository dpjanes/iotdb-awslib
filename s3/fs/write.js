/**
 *  s3/write.js
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
const write = _.promise.make((self, done) => {
    const method = "aws.s3.fs.write"
    const aws = require("../..")

    assert.ok(_.is.String(self.path), `${method}: self.path must be String`)

    _.promise.make(self)
        .then(aws.s3.parse_path)
        .then(aws.s3.upload_document)
        .then(_.promise.done(done, self))
        .catch(done)
})

/**
 */
const write_p = (_path, _document, _document_encoding) => _.promise.make((self, done) => {
    _.promise.make(self)
        .then(_.promise.add({
            path: _path || null,
            document: _document || null,
            document_encoding: _document_encoding || null,
        }))
        .then(write)
        .then(_.promise.done(done, self))
        .catch(done)
})

/*
 *  API
 */
exports.write = write
exports.write.p = write_p
