/**
 *  dynamodb/delete_item.js
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
const Q = require("q");

/**
 *  Accepts: 
 *  Produces:
 */
const delete_item = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "dynamodb.delete_item";

    assert.ok(self.dynamodb_client, `${method}: self.dynamodb is required`);
    assert.ok(_.is.String(self.table_name), `${method}: self.table_name must be a String`);
    assert.ok(_.is.JSON(self.query), `${method}: self.query must be a JSON-like object`);

    self.dynamodb_client.deleteItem({
        TableName : self.table_name,
        Key: self.json,
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
exports.delete_item = Q.denodeify(delete_item);
