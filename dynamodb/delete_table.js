/**
 *  dynamodb/delete_table.js
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
const Q = require("bluebird-q");

/**
 *  Accepts: 
 *  Produces:
 */
const delete_table = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "dynamodb.delete_table";

    assert.ok(self.dynamodb, `${method}: self.dynamodb is required`);
    assert.ok(_.is.String(self.table_name), `${method}: self.table_name must be a String`);

    self.dynamodb.deleteTable({
        TableName: self.table_name,
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
exports.delete_table = Q.denodeify(delete_table);
