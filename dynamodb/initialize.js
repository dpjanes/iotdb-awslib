/**
 *  dynamodb/initialize.js
 *
 *  David Janes
 *  IOTDB
 *  2017-02-09
 *
 *  Copyright (2013-2017) David Janes
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
    const method = "dynamodb.initialize";

    assert.ok(self.AWS, `${method}: self.AWS is required`);

    self.dynamodb = new AWS.DynamoDB({
        apiVersion: "2012-08-10",
    });
    self.dynamodb_client = new AWS.DynamoDB.DocumentClient();

    done(null, self);
}

/**
 *  API
 */
exports.initialize = _.promise.denodeify(initialize);
