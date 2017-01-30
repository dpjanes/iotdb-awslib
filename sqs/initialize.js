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
const Q = require("q");

/**
 *  Accepts: 
 *  Produces:
 */
const initialize = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "sqs.initialize";

    assert.ok(self.AWS, `${method}: self.AWS is required`);
    assert.ok(_.is.String(self.queue), `${method}: self.queue must be a string`);

    self.AWS.config.apiVersions = {
        s3: self.AWS.config.apiVersions || '2012-11-05',
    };

    self.sqs = new AWS.SQS();

    done(null, self);
}

/**
 *  API
 */
exports.initialize = Q.denodeify(initialize);
