/**
 *  dynamodb/get.js
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
const get = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "dynamodb.get";

    assert.ok(self.dynamodb_client, `${method}: self.dynamodb is required`);
    assert.ok(_.is.String(self.table_name), `${method}: self.table_name must be a String`);
    assert.ok(_.is.JSON(self.query), `${method}: self.query must be a JSON-like object`);

    self.dynamodb_client.get({
        TableName: self.table_name,
        Key: self.query,
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        self.json = null;
        if (data.Item) {
            self.json = data.Item;
        }

        self.aws_result = data;

        done(null, self);
    })
}

/**
 *  API
 */
exports.get = _.promise.denodeify(get);
