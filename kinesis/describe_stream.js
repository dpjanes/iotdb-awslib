/**
 *  kinesis/describe_stream.js
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
 *  Accepts: self.kinesis, 
 *  Produces: self.streams
 */
const describe_stream = _.promise.make((self, done) => {
    const method = "kinesis.describe_stream";

    assert.ok(self.kinesis, `${method}: self.kinesis is required`);
    assert.ok(_.is.String(self.stream), `${method}: self.stream is required`);

    self.kinesis.describeStream({
        StreamName: self.stream,
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        self.stream_description = data.StreamDescription;

        done(null, self);
    })
})

/**
 *  API
 */
exports.describe_stream = describe_stream;
