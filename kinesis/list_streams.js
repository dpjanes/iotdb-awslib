/**
 *  kinesis/list_streams.js
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
 *  Produces: self.stream_names
 */
const list_streams = _.promise.make((self, done) => {
    const method = "kinesis.list_streams";

    assert.ok(self.kinesis, `${method}: self.kinesis is required`);

    self.kinesis.listStreams({
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        self.stream_names = data.StreamNames

        done(null, self);
    })
})

/**
 *  API
 */
exports.list_streams = list_streams;
