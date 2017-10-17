/**
 *  dynamodb/wait_table_exists.js
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
const wait_table_exists = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "dynamodb.wait_table_exists";

    assert.ok(self.dynamodb, `${method}: self.dynamodb is required`);
    assert.ok(_.is.String(self.table_name), `${method}: self.table_name must be a String`);

    self.dynamodb.waitFor("tableExists", {
        TableName : self.table_name,
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
exports.wait_table_exists = _.promise.denodeify(wait_table_exists);
