/**
 *  cloudwatch/initialize.js
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

const AWS = require("aws-sdk");

/**
 *  Requires: self.AWS
 *  Produces: self.cloudwatch, self.cloudwatchlogs
 */
const initialize = _.promise.make((self, done) => {
    const method = "cloudwatch.initialize";

    assert.ok(self.AWS, `${method}: self.AWS is required`);

    self.cloudwatch = new AWS.CloudWatch({
        apiVersion: '2010-08-01',
    });
    self.cloudwatchlogs = new AWS.CloudWatchLogs({
        apiVersion: '2014-03-28'
    });

    done(null, self);
})

/**
 *  API
 */
exports.initialize = initialize;
