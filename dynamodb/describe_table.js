/**
 *  dynamodb/describe_table.js
 *
 *  David Janes
 *  IOTDB
 *  2017-06-28
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const AWS = require("aws-sdk");

/**
 *  Accepts: self.table_name
 *  Produces: self.table, self.aws_result
 */
const describe_table = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "dynamodb.describe_table";

    assert.ok(self.dynamodb, `${method}: self.dynamodb is required`);
    assert.ok(_.is.String(self.table_name), `${method}: self.table_name must be a String`);

    self.dynamodb.describeTable({
        TableName: self.table_name,
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        self.table = data.Table;
        self.aws_result = data;

        done(null, self);
    })
}

/**
 *  API
 */
exports.describe_table = _.promise.denodeify(describe_table);
