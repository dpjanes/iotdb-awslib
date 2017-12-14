/**
 *  cloudwatch/create_log_stream.js
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
 *  Requires: self.cloudwatch, self.log_stream
 *  Produces: self.aws_result
 */
const create_log_stream = _.promise.make((self, done) => {
    const method = "cloudwatch.create_log_stream";

    assert.ok(self.cloudwatchlogs, `${method}: self.cloudwatch is required`);
    assert.ok(_.is.String(self.log_stream), `${method}: self.log_stream must be a String`);

    self.cloudwatchlogs.createLogStream({
        logStream: self.log_stream,
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        self.aws_result = data;

        done(null, self);
    });
})

/**
 *  API
 */
exports.create_log_stream = create_log_stream;
