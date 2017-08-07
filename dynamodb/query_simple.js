/**
 *  dynamodb/query_simple.js
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

const util = require("./util");

/**
 *  Requires: self.dynamodb_client, self.table_name, self.query
 *  Acepts: self.index_name, self.pager, self.query_limit, self.query_attributes
 *  Produces: self.json, self.jsons, self.cursor
 */
const query_simple = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "dynamodb.query_simple";

    assert.ok(self.dynamodb_client, `${method}: self.dynamodb is required`);
    assert.ok(_.is.String(self.table_name), `${method}: self.table_name must be a String`);
    assert.ok(_.is.String(self.index_name) || _.is.Nullish(self.index_name), `${method}: self.table_name must be a String or Nyll`);
    assert.ok(_.is.JSON(self.query), `${method}: self.query must be a JSON-like object`);
    assert.ok(_.is.Array.of.String(self.query_attributes) || !self.query_attributes, 
        `${method}: self.query_attributes must be Null or an Array of String`);
    assert.ok(_.is.String(self.pager) || _.is.Nullish(self.pager), `${method}: self.pager must be a String or Nullish`);
    assert.ok(_.is.Integer(self.query_limit) || _.is.Nullish(self.query_limit), `${method}: self.query_limit must be an Integer or Nullish`);

    const KeyConditionExpression = [];
    const ExpressionAttributeNames = {};
    const ExpressionAttributeValues = {};
    _.mapObject(self.query, (value, key) => {
        ExpressionAttributeValues[`:${key}`] = value;

        if (_.is.Number(value)) {
            ExpressionAttributeNames[`#${key}`] = key;
            KeyConditionExpression.push(`#${key} = :${key}`)
        } else {
            KeyConditionExpression.push(`${key} = :${key}`)
        }
    })

    let ProjectionExpression = null;
    if (self.query_attributes) {
        self.query_attributes.forEach(attribute => {
            if (util.key_type(attribute) === 'N') {
                ExpressionAttributeNames[`${attribute}`] = util.key_name(attribute);
            }
        });

        ProjectionExpression = self.query_attributes.join(", ");
    }
    
    const initd = {
        TableName: self.table_name,
        KeyConditionExpression: KeyConditionExpression.join(" and "),
        ExpressionAttributeNames: _.is.Empty(ExpressionAttributeNames) ? null : ExpressionAttributeNames,
        ExpressionAttributeValues: ExpressionAttributeValues,
        ProjectionExpression: ProjectionExpression,
        Limit: self.query_limit ? self.query_limit : null,
    };

    if (!_.is.Nullish(self.scan_index_forward)) {
        initd.ScanIndexForward = self.scan_index_forward ? true : false;
    }

    if (!_.is.Nullish(self.index_name)) {
        initd.IndexName = self.index_name;
    }

    if (self.pager) {
        initd.ExclusiveStartKey = _.id.unpack(self.pager)
    }

    self.dynamodb_client.query(initd, (error, data) => {
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

        self.cursor = null;

        if (self.query_limit) {
            self.cursor = {
                current: self.pager || null,
                next: null,

                is_first: self.pager ? true : false,
                is_last: null,
                has_next: null,
            }

            if (data.LastEvaluatedKey) {
                self.cursor.next = _.id.pack(data.LastEvaluatedKey);
                self.cursor.has_next = true;
            } else {
                self.cursor.next = null;
                self.cursor.is_last = true;
            }
        }

        done(null, self);
    })
}

/**
 *  API
 */
exports.query_simple = Q.denodeify(query_simple);
