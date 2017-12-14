/**
 *  cloudwatch/log_jsons.js
 *
 *  David Janes
 *  IOTDB
 *  2017-12-13
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

/**
 *  Requires: self.cloudwatch, self.log_group, seld.log_stream, self.jsons
 *  Accepts: self.sequence_token
 *  Produces: self.aws_result, self.sequence_token
 *
 *  This is very much set up around logging Bunyan messages, with
 *  an IOTDB twist.
 */
const log_jsons = _.promise.make((self, done) => {
    const method = "cloudwatch.log_jsons";

    assert.ok(self.cloudwatchlogs, `${method}: self.cloudwatch is required`);
    assert.ok(_.is.Array.of.Dictionary(self.jsons), `${method}: self.jsons must be an Array of Dictionary`);
    assert.ok(_.is.String(self.log_group), `${method}: self.log_group must be a String`);
    assert.ok(_.is.String(self.log_stream), `${method}: self.log_stream must be a String`);
    assert.ok(_.is.Nullish(self.sequence_token) || _.is.String(self.sequence_token), 
        `${method}: self.sequence_token must be a String or Null`);

    const params = {
        logEvents: self.jsons
            .map(json => ({
                message: JSON.stringify(json, null, 0),
                timestamp: new Date(json["@created"] || json.time || 0).getTime(),
            }))
            .filter(event => event.timestamp)
            .sort((a, b) => a.timestamp - b.timestamp),
        logGroupName: self.log_group,
        logStreamName: self.log_stream,
    }

    if (self.sequence_token) {
        params.sequenceToken = self.sequence_token;
    }

    console.log("HERE:CW:PUT", params);

    self.cloudwatchlogs.putLogEvents(params, (error, data) => {
        if (error) {
            return done(error);
        }

        self.aws_result = data;
        self.sequence_token = data.nextSequenceToken;

        done(null, self);
    });
})

/**
 *  API
 */
exports.log_jsons = log_jsons;
