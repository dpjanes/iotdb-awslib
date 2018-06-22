/**
 *  ecr/initialize.js
 *
 *  David Janes
 *  IOTDB
 *  2018-06-22
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict"

const _ = require("iotdb-helpers")

const assert = require("assert")

const AWS = require("aws-sdk")

/**
 *  Accepts: N/A
 *  Produces: self.ecr
 */
const initialize = _.promise.make(self => {
    const method = "ecr.initialize";

    assert.ok(self.AWS, `${method}: self.AWS is required`);

    self.ecr = new AWS.ECR({
        apiVersion: "2015-09-21"
    });
})

/**
 *  API
 */
exports.initialize = initialize;
