/**
 *  sns/initialize.js
 *
 *  David Janes
 *  IOTDB
 *  2017-07-11
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const AWS = require("aws-sdk");

/**
 *  Accepts: self.AWS
 *  Produces: self.sns
 */
const initialize = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "sns.initialize";

    assert.ok(self.AWS, `${method}: self.AWS is required`);

    self.sns = new AWS.SNS({
        apiVersion: '2010-03-31',
    });

    done(null, self);
}

/**
 *  API
 */
exports.initialize = _.promise.denodeify(initialize);
