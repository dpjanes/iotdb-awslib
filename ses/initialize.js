/**
 *  ses/initialize.js
 *
 *  David Janes
 *  IOTDB
 *  2017-10-16
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const AWS = require("aws-sdk");
const Q = require("bluebird-q");

/**
 *  Accepts: N/A
 *  Produces:
 */
const initialize = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "ses.initialize";

    assert.ok(self.AWS, `${method}: self.AWS is required`);

    self.ses = new AWS.SES({
        apiVersion: '2010-12-01',
    });

    done(null, self);
}

/**
 *  API
 */
exports.initialize = Q.denodeify(initialize);
