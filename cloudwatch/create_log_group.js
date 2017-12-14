/**
 *  cloudwatch/create_log_group.js
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
 *  Requires: self.cloudwatch, self.log_group
 *  Produces: self.aws_result
 *
 */
const create_log_group = _.promise.make((self, done) => {
    const method = "cloudwatch.create_log_group";

    assert.ok(self.cloudwatchlogs, `${method}: self.cloudwatch is required`);
    assert.ok(_.is.String(self.log_group), `${method}: self.log_group must be a String`);

    self.cloudwatchlogs.createLogGroup({
        logGroup: self.log_group,
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
exports.create_log_group = create_log_group;
