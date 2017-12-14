/**
 *  kinesis/initialize.js
 *
 *  David Janes
 *  IOTDB
 *  2017-04-23
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const AWS = require("aws-sdk");

/**
 *  Accepts: N/
 *  Produces:
 */
const initialize = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "kinesis.initialize";

    assert.ok(self.AWS, `${method}: self.AWS is required`);

    self.kinesis = new AWS.Kinesis({
        apiVersion: '2013-12-02',
    });

    done(null, self);
}

/**
 *  API
 */
exports.initialize = _.promise.denodeify(initialize);
