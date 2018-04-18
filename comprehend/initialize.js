/**
 *  comprehend/initialize.js
 *
 *  David Janes
 *  IOTDB
 *  2018-04-18
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const AWS = require("aws-sdk");

/**
 *  Accepts: N/A
 *  Produces: self.translate
 */
const initialize = _.promise.make(self => {
    const method = "translate.initialize";

    assert.ok(self.AWS, `${method}: self.AWS is required`);

    self.comprehend = new AWS.Comprehend({
        apiVersion: "2017-11-27",
    });
})

/**
 *  API
 */
exports.initialize = initialize;
