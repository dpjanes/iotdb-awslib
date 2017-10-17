/**
 *  dynamodb/update.js
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
const update = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "dynamodb.update";

    asser.ok(false, `${method}: this flat out doesn't work`);
    assert.ok(self.dynamodb_client, `${method}: self.dynamodb is required`);
    assert.ok(_.is.String(self.table_name), `${method}: self.table_name must be a String`);
    assert.ok(_.is.JSON(self.json), `${method}: self.json must be a JSON-like object`);
    assert.ok(_.is.JSON(self.query), `${method}: self.query must be a JSON-like object`);

    self.dynamodb_client.update({
        TableName : self.table_name,
        Key: self.query,
        Item: self.json,
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
exports.update = _.promise.denodeify(update);
