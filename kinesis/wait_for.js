/**
 *  kinesis/wait_for.js
 *
 *  David Janes
 *  IOTDB
 *  2017-12-14
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

/**
 *  Accepts: self.kinesis, self.stream
 *  Produces: self.streams
 */
const wait_for = _.promise.make((self, done) => {
    const method = "kinesis.wait_for";

    assert.ok(self.kinesis, `${method}: self.kinesis is required`);
    assert.ok(_.is.String(self.stream), `${method}: self.stream is required`);
    assert.ok(_.is.String(self.resource), `${method}: self.resource is required`);

    self.kinesis.waitFor(self.resource, {
        StreamName: self.stream,
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        self.aws_result = data;

        done(null, self);
    })
})

/**
 *  API
 */
exports.wait_for = wait_for;
