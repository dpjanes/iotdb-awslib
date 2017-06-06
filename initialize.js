/**
 *  initialize.js
 *
 *  David Janes
 *  IOTDB
 *  2017-01-18
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const AWS = require("aws-sdk");
const Q = require("bluebird-q");

/**
 *  Accepts: self.awsd
 *  Produces: self.AWS
 */
const initialize = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "initialize"

    assert.ok(self.awsd, `${method}: self.awsd expected`)

    if (self.awsd.accessKeyId && self.awsd.secretAccessKey) {
        AWS.config.credentials = new AWS.Credentials(self.awsd.accessKeyId, self.awsd.secretAccessKey);
    } else if (self.awsd.profile) {
        AWS.config.credentials = new AWS.SharedIniFileCredentials({
            profile: self.awsd.profile,
        });
    }

    if (self.awsd.region) {
        AWS.config.region = self.awsd.region;
    }

    self.AWS = AWS;

    done(null, self);
}

/**
 *  API
 */
exports.initialize = Q.denodeify(initialize);
