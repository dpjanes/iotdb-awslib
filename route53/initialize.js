/**
 *  route53/initialize.js
 *
 *  David Janes
 *  IOTDB
 *  2018-03-08
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict"

const _ = require("iotdb-helpers")

const assert = require("assert")

const AWS = require("aws-sdk")

/**
 *  Accepts: N/A
 *  Produces: self.route53
 */
const initialize = _.promise.make(self => {
    const method = "route53.initialize";

    assert.ok(self.AWS, `${method}: self.AWS is required`);

    self.route53 = new AWS.Route53({
        apiVersion: "2013-04-01",
    });
})

/**
 *  API
 */
exports.initialize = initialize;
