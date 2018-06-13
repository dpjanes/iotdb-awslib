/**
 *  sqs/initialize.js
 *
 *  David Janes
 *  IOTDB
 *  2017-01-30
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const AWS = require("aws-sdk");

/**
 *  Accepts: 
 *  Produces:
 */
const initialize = _.promise.make((self, done) => {
    const method = "sqs.initialize";

    assert.ok(self.AWS, `${method}: self.AWS is required`);

    self.sqs = new AWS.SQS({
        apiVersion: '2012-11-05',
    });

    done(null, self);
})

/**
 *  API
 */
exports.initialize = initialize
