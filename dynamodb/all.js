/**
 *  dynamodb/all.js
 *
 *  David Janes
 *  IOTDB
 *  2017-03-25
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const AWS = require("aws-sdk");
const Q = require("bluebird-q");

const util = require("./util");

/**
 *  Accepts: 
 *  Produces:
 */
const all = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "dynamodb.all";

    assert.ok(self.dynamodb_client, `${method}: self.dynamodb is required`);
    assert.ok(_.is.String(self.table_name), `${method}: self.table_name must be a String`);

    const initd = {
        TableName: self.table_name,
        Limit: self.query_limit ? self.query_limit : null,
    };
    
    self.dynamodb_client.scan(initd, (error, data) => {
        if (error) {
            return done(error);
        }

        self.jsons = []
        self.json = null;

        if (data.Items) {
            self.jsons = data.Items;

            if (self.jsons.length) {
                self.json = self.jsons[0];
            }
        }

        self.aws_result = data;

        done(null, self);
    })
}

/**
 *  API
 */
exports.all = Q.denodeify(all);
