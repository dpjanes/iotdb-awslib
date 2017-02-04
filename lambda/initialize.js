/**
 *  lambda/initialize.js
 *
 *  David Janes
 *  IOTDB
 *  2017-02-04
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const AWS = require("aws-sdk");
const Q = require("q");

/**
 *  Accepts: 
 *  Produces:
 */
const initialize = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "sqs.initialize";

    assert.ok(self.AWS, `${method}: self.AWS is required`);

    self.AWS.config.apiVersions = {
        lambda: self.AWS.config.apiVersions || '2015-03-31',
    };

    self.lambda = new AWS.Lambda();

    done(null, self);
}

/**
 *  API
 */
exports.initialize = Q.denodeify(initialize);
