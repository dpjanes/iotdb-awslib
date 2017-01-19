/**
 *  s3/initialize.js
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
    const method = "s3.initialize";

    assert.ok(self.AWS, `${method}: self.AWS is required`);

    self.AWS.config.apiVersions = {
        s3: self.AWS.config.apiVersions || '2006-03-01',
    };

    self.s3 = new AWS.S3();

    done(null, self);
}

/**
 *  API
 */
exports.initialize = Q.denodeify(initialize);