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
    assert.ok(_.is.String(self.start_time) || _.is.Integer(self.start_time) || _.is.Nullish(self.start_time), 
        `${method}: self.start_time must be a String, Integer or Null`);
    assert.ok(_.is.String(self.end_time) || _.is.Integer(self.end_time) || _.is.Nullish(self.end_time), 
        `${method}: self.end_time must be a String, Integer or Null`);

    const params = {
        logGroupName: self.log_group,
        logStreamName: self.log_stream,
    }

    if (self.pager) {
        params.nextToken = self.pager;
    }
    if (self.start_time) {
        params.startTime = _.is.String(self.start_time) ? new Date(self.start_time).getTime() : self.start_time;
    }
    if (self.end_time) {
        params.endTime = _.is.String(self.end_time) ? new Date(self.end_time).getTime() : self.end_time;
    }

    self.cloudwatchlogs.getLogEvents(params, (error, data) => {
        if (error) {
            return done(error);
        }

        self.aws_result = data;
        self.log_events = data.events;
        self.cursor = {
            next: data.nextForwardToken,
        }

        done(null, self);
    });
})

/**
 *  Paramaterized
 */
const after = time => _.promise.make((self, done) => {
    _.promise.make(self)
        .then(_.promise.add({
            start_time: start_time || self.start_time || 0,
        }))
        .then(exec)
        .then(_.promise.done(done, self, "aws_result,log_events,cursor"))
        .catch(done)
})

const before = time => _.promise.make((self, done) => {
    _.promise.make(self)
        .then(_.promise.add({
            end_time: end_time || self.end_time || 0,
        }))
        .then(exec)
        .then(_.promise.done(done, self, "aws_result,log_events,cursor"))
        .catch(done)
})

/**
 *  API
 */
exports.get_log_events = get_log_events;
exports.get_log_events.before = before;
exports.get_log_events.after = after;
