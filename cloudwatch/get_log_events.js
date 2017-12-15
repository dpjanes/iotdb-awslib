/**
 *  cloudwatch/get_log_events.js
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
 *  Requires: self.cloudwatch
 *  Accepts: self.log_group_prefix
 *  Produces: self.aws_result, self.log_group_descriptiopns, self.log_groups, self.cursor
 */
const get_log_events = _.promise.make((self, done) => {
    const method = "cloudwatch.get_log_events";

    assert.ok(self.cloudwatchlogs, `${method}: self.cloudwatch is required`);
    assert.ok(_.is.String(self.log_stream), `${method}: self.log_stream must be a String`);
    assert.ok(_.is.String(self.log_group), `${method}: self.log_group must be a String`);

    const params = {
        logGroupName: self.log_group,
        logStreamName: self.log_stream,
    }

    if (self.pager) {
        params.nextToken = self.pager;
    }

    self.cloudwatchlogs.getLogEvents(params, (error, data) => {
        if (error) {
            return done(error);
        }

        self.aws_result = data;
        self.events = data.events;
        self.cursor = {
            next: data.nextForwardToken,
        }

        done(null, self);
    });
})

/**
 *  API
 */
exports.get_log_events = get_log_events;
