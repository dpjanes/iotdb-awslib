/**
 *  cloudwatch/send.js
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
 *  Requires: self.cloudwatch
 *  Produces: self.aws_result
 */
const send = _.promise.make((self, done) => {
    const method = "cloudwatch.send";

    assert.ok(self.cloudwatch, `${method}: self.cloudwatch is required`);

    self.cloudwatch.sendEmail(message, (error, data) => {
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
exports.send = send;
