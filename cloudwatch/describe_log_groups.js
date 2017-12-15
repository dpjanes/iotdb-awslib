/**
 *  cloudwatch/describe_log_groups.js
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
const describe_log_groups = _.promise.make((self, done) => {
    const method = "cloudwatch.describe_log_groups";

    assert.ok(self.cloudwatchlogs, `${method}: self.cloudwatch is required`);
    assert.ok(_.is.Nullish(self.log_group_prefix) || _.is.String(self.log_group_prefix), 
        `${method}: self.log_group_prefix must be a String or Nullish`);

    const params = {
        logGroup: self.log_group,
    }

    if (self.log_group_prefix) {
        params.logGroupNamePrefix = self.log_group_prefix;
    }

    if (self.pager) {
        params.nextToken = self.pager;
    }

    self.cloudwatchlogs.describeLogGroups(params, (error, data) => {
        if (error) {
            return done(error);
        }

        self.aws_result = data;
        self.log_group_descriptions = data.logGroups;
        self.log_groups = data.logGroups.map(lgd => lgd.logGroupName)
        self.cursor = {
            next: data.nextToken,
        }

        done(null, self);
    });
})

/**
 *  API
 */
exports.describe_log_groups = describe_log_groups;
