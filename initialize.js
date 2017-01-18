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
const Q = require("q");

/**
 *  Accepts: 
 *  Produces:
 */
const initialize = (_self, done) => {
    const self = _.d.clone.shallow(_self);

    const profile = _.d.first(self, "/aws/profile")
    if (!_.is.Empty(profile)) {
        const credentials = new AWS.SharedIniFileCredentials({
            profile: profile,
        });

        AWS.config.credentials = credentials;
    }

    self.AWS = AWS;

    done(null, self);
}

/**
 *  API
 */
exports.initialize = Q.denodeify(initialize);
