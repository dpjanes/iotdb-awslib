/**
 *  dynamodb/create_table.js
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

const _key_name = key => key.replace(/^[#!]/, "")
const _key_type = key => {
    if (key.match(/^#/)) {
        return "N";
    } else if (key.match(/^!/)) {
        return "B";
    } else {
        return "S";
    }
}

/**
 *  Accepts: 
 *  Produces:
 */
const create_table = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "dynamodb.create_table";

    assert.ok(self.dynamodb, `${method}: self.dynamodb is required`);
    assert.ok(_.is.String(self.table_name), `${method}: self.table_name must be a String`);
    assert.ok(_.is.String(self.primary_key), `${method}: self.primary_key must be a String`);
    assert.ok(_.is.String(self.sort_key) || !self.sort_key, `${method}: self.sort_key must be a String or Null`);
    assert.ok(_.is.Array.of.String(self.sort_keys) || !self.sort_keys, `${method}: self.sort_keys must be an Array of String or Null`);

    const initd = {
        TableName : self.table_name,
        KeySchema: [],
        AttributeDefinitions: [],
        ProvisionedThroughput: {       
            ReadCapacityUnits: self.read_capacity_units || 5, 
            WriteCapacityUnits: self.write_capacity_units || 5,
        },
    };

    initd.KeySchema.push({
        AttributeName: _key_name(self.primary_key),
        KeyType: "HASH",
    })

    initd.AttributeDefinitions.push({
        AttributeName: _key_name(self.primary_key),
        AttributeType: _key_type(self.primary_key),
    })

    const sort_keys = self.sort_keys ? self.sort_keys : self.sort_key ? [ self.sort_key ] : [];
    sort_keys.forEach(sort_key => {
        initd.KeySchema.push({
            AttributeName: _key_name(sort_key),
            KeyType: "RANGE",
        })

        initd.AttributeDefinitions.push({
            AttributeName: _key_name(sort_key),
            AttributeType: _key_type(sort_key),
        })
    })

    self.dynamodb.createTable(initd, (error, data) => {
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
exports.create_table = Q.denodeify(create_table);
