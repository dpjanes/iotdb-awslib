/**
 *  ecs/initialize.js
 *
 *  David Janes
 *  IOTDB
 *  2017-12-04
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const AWS = require("aws-sdk");

/**
 *  Accepts: N/A
 *  Produces:
 */
const initialize = _.promise.make((self, done) => {
    const method = "ecs.initialize";

    assert.ok(self.AWS, `${method}: self.AWS is required`);

    self.ecs = new AWS.SES({
        apiVersion: "2014-11-13",
    });

    done(null, self);
})

/**
 *  API
 */
exports.initialize = initialize;
