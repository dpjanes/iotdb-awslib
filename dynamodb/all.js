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
 *  Requires: self.dynamodb_client, self.table_name
 *  Acepts: self.pager, self.query_limit
 *  Produces: self.json, self.jsons, self.pager
 */
const all = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "dynamodb.all";

    assert.ok(self.dynamodb_client, `${method}: self.dynamodb is required`);
    assert.ok(_.is.String(self.table_name), `${method}: self.table_name must be a String`);
    assert.ok(_.is.String(self.pager) || _.is.Nullish(self.pager), `${method}: self.pager must be a String or Nullish`);
    assert.ok(_.is.Integer(self.query_limit) || _.is.Nullish(self.query_limit), `${method}: self.query_limit must be an Integer or Nullish`);

    const initd = {
        TableName: self.table_name,
        Limit: self.query_limit ? self.query_limit : null,
    };

    if (self.pager) {
        initd.ExclusiveStartKey = _.id.unpack(self.pager)
    }
    
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

        if (data.LastEvaluatedKey) {
            self.pager = _.id.pack(data.LastEvaluatedKey);
        } else {
            self.pager = null;
        }

        self.aws_result = data;

        done(null, self);
    })
}

/**
 *  API
 */
exports.all = Q.denodeify(all);
