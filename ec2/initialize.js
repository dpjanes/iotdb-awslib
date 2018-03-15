/**
 *  ec2/initialize.js
 *
 *  David Janes
 *  IOTDB
 *  2018-03-15
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict"

const _ = require("iotdb-helpers")

const assert = require("assert")

const AWS = require("aws-sdk")

/**
 *  Accepts: N/A
 *  Produces: self.ec2
 */
const initialize = _.promise.make(self => {
    const method = "ec2.initialize";

    assert.ok(self.AWS, `${method}: self.AWS is required`);

    self.ec2 = new AWS.EC2({
        apiVersion: "2016-11-15",
    });
})

/**
 *  API
 */
exports.initialize = initialize;
