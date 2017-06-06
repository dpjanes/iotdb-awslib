/**
 *  sqs/initialize.js
 *
 *  David Janes
 *  IOTDB
 *  2017-01-30
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const AWS = require("aws-sdk");
const Q = require("bluebird-q");

/**
 *  Accepts: 
 *  Produces:
 */
const initialize = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "sqs.initialize";

    assert.ok(self.AWS, `${method}: self.AWS is required`);

    self.sqs = new AWS.SQS({
        apiVersion: '2012-11-05',
    });

    done(null, self);
}

/**
 *  API
 */
exports.initialize = Q.denodeify(initialize);
