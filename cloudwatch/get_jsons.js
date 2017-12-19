/**
 *  cloudwatch/get_jsons.js
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

const aws = {
    cloudwatch: {
        get_log_events: require("./get_log_events").get_log_events,
    },
};

/**
 *  Requires: self.cloudwatch, self.log_stream, self.log_group
 *  Produces: self.jsons, self.cursor
 */
const get_jsons = _.promise.make((self, done) => {
    const method = "cloudwatch.get_jsons";

    assert.ok(self.cloudwatchlogs, `${method}: self.cloudwatch is required`);
    assert.ok(_.is.String(self.log_stream), `${method}: self.log_stream must be a String`);
    assert.ok(_.is.String(self.log_group), `${method}: self.log_group must be a String`);

    _.promise.make(self)
        .then(aws.cloudwatch.get_log_events)
        .then(_.promise.make(sd => {
            sd.jsons = sd.log_events.map(le => le.message);
        }))
        .then(_.promise.done(done, self, "jsons,cursor"))
        .catch(done)
})

/**
 *  Paramaterized
 */
const after = start_time => _.promise.make((self, done) => {
    _.promise.make(self)
        .then(_.promise.add({
            start_time: start_time || self.start_time || 0,
        }))
        .then(get_jsons)
        .then(_.promise.done(done, self, "jsons,cursor"))
        .catch(done)
})

const before = end_time => _.promise.make((self, done) => {
    _.promise.make(self)
        .then(_.promise.add({
            end_time: end_time || self.end_time || 0,
        }))
        .then(get_jsons)
        .then(_.promise.done(done, self, "jsons,cursor"))
        .catch(done)
})

/**
 *  API
 */
exports.get_jsons = get_jsons;
exports.get_jsons.before = before;
exports.get_jsons.after = after;
