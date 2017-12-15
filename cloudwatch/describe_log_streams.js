/**
 *  cloudwatch/describe_log_streams.js
 *
 *  David Janes
 *  IOTDB
 *  2017-12-15
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

/**
 *  Requires: self.cloudwatch, self.log_group
 *  Accepts: self.log_stream_prefix
 *  Produces: self.aws_result, self.log_stream_descriptiopns, self.log_streams, self.cursor
 */
const describe_log_streams = _.promise.make((self, done) => {
    const method = "cloudwatch.describe_log_streams";

    assert.ok(self.cloudwatchlogs, `${method}: self.cloudwatch is required`);
    assert.ok(_.is.String(self.log_group), `${method}: self.log_group must be a String`);
    assert.ok(_.is.Nullish(self.log_stream_prefix) || _.is.String(self.log_stream_prefix), 
        `${method}: self.log_stream_prefix must be a String or Nullish`);

    const params = {
        logGroupName: self.log_group,
    }

    if (self.log_stream_prefix) {
        params.logStreamNamePrefix = self.log_stream_prefix;
    }

    if (self.pager) {
        params.nextToken = self.pager;
    }

    self.cloudwatchlogs.describeLogStreams(params, (error, data) => {
        if (error) {
            return done(error);
        }

        self.aws_result = data;
        self.log_stream_descriptions = data.logStreams;
        self.log_streams = data.logStreams.map(lgd => lgd.logStreamName)
        self.cursor = {
            next: data.nextToken,
        }

        done(null, self);
    });
})

/**
 *  API
 */
exports.describe_log_streams = describe_log_streams;
