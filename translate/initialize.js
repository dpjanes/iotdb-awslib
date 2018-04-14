/**
 *  translate/initialize.js
 *
 *  David Janes
 *  IOTDB
 *  2018-04-14
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

    self.translate = new AWS.Translate({
        apiVersion: "2017-07-01",
    });
})

/**
 *  API
 */
exports.initialize = initialize;
