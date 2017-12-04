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
 *  Produces: self.ecs
 */
const initialize = _.promise.make(self => {
    const method = "ecs.initialize";

    assert.ok(self.AWS, `${method}: self.AWS is required`);

    self.ecs = new AWS.ECS({
        apiVersion: "2014-11-13",
    });
})

/**
 *  API
 */
exports.initialize = initialize;
