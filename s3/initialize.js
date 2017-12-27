/**
 *  s3/initialize.js
 *
 *  David Janes
 *  IOTDB
 *  2017-01-18
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
const initialize = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "s3.initialize";

    assert.ok(self.AWS, `${method}: self.AWS is required`);

    self.s3 = new AWS.S3({
        apiVersion: '2006-03-01',
    });

    done(null, self);
}

/**
 *  API
 */
exports.initialize = _.promise.denodeify(initialize);
