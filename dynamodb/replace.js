/**
 *  dynamodb/replace.js
 *
 *  David Janes
 *  IOTDB
 *  2017-04-23
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
 *
 *  Very similar to `put`, except the object must already exist
 */
const replace = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "dynamodb.replace";

    assert.ok(self.dynamodb_client, `${method}: self.dynamodb is required`);
    assert.ok(_.is.String(self.table_name), `${method}: self.table_name must be a String`);
    assert.ok(_.is.JSON(self.json), `${method}: self.json must be a JSON-like object`);
    assert.ok(_.is.JSON(self.query), `${method}: self.query must be a JSON-like object`);

    const expected = {};

    _.mapObject(self.query, (value, key) => {
        expected[key] = {
            ComparisonOperator: "EQ",
            Value: value,
        }
    })

    self.dynamodb_client.put({
        TableName : self.table_name,
        Item: self.json,
        Expected: expected,
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        self.aws_result = data;

        done(null, self);
    })
}

/**
 *  API
 */
exports.replace = Q.denodeify(replace);
