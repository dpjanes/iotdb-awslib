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
    assert.ok(_.is.String(self.index_name) || _.is.Nullish(self.index_name), 
        `${method}: self.table_name must be a String or Nyll`);
    assert.ok(_.is.JSON(self.query), `${method}: self.query must be a JSON-like object`);
    assert.ok(_.is.Array.of.String(self.query_attributes) || !self.query_attributes, 
        `${method}: self.query_attributes must be Null or an Array of String`);
    assert.ok(_.is.String(self.pager) || _.is.Nullish(self.pager), `${method}: self.pager must be a String or Nullish`);
    assert.ok(_.is.Integer(self.query_limit) || _.is.Nullish(self.query_limit), 
        `${method}: self.query_limit must be an Integer or Nullish`);

    const KeyConditionExpression = [];
    const ExpressionAttributeNames = {};
    const ExpressionAttributeValues = {};

    _.mapObject(self.query, (value, key) => {

        if (_.is.Array(value)) {
            /*
             *  THIS IS NOT WORKING YET
             *  Just not worth my effort to continue
             *  DPJ 2017-11-11
             */
            let position = 0;
            while (position < value.length) {
                let comparitor;

                switch (value[position].toLowerCase()) {
                case "=": case "eq":
                    comparitor = comparitor ? comparitor : "="; // fallthru
                case "!=": case "ne":
                    comparitor = comparitor ? comparitor : "!="; // fallthru
                case "<": case "lt":
                    comparitor = comparitor ? comparitor : "<"; // fallthru
                case "<=": case "le":
                    comparitor = comparitor ? comparitor : "LE"; // fallthru
                case ">": case "gt":
                    comparitor = comparitor ? comparitor : "GT"; // fallthru
                case ">=": case "ge":
                    comparitor = comparitor ? comparitor : "GE"; // fallthru

                // everything falls thru to here
                {
                    const key_typed = _.is.Number(value[position + 1]) ? `#${key}` : key;
                    if (_.is.Number(value[position + 1])) {
                        ExpressionAttributeNames[key_typed] = key;
                    }
                    const value_1 = `:p${position+1}`;

                    KeyConditionExpression.push(`${key_typed} ${comparitor} ${value_1}`);
                    ExpressionAttributeValues[value_1] = value[position+1]

                    position += 2;
                }
                    break;

                case "between":
                {
                    const key_typed = _.is.Number(value[position+1]) ? `#${key}` : key;
                    if (_.is.Number(value[position + 1])) {
                        ExpressionAttributeNames[key_typed] = key;
                    }
                    const value_1 = `:p${position+1}`;
                    const value_2 = `:p${position+2}`;

                    KeyConditionExpression.push(`${key_typed} BETWEEN ${value_1} AND ${value_2}`);
                    ExpressionAttributeValues[value_1] = value[position+1]
                    ExpressionAttributeValues[value_2] = value[position+2]

                    position += 3;
                }
                    break;

                default:
                    console.log("wha?")
                    process.exit(1)
                }

            }
        } else if (_.is.Number(value)) {
            ExpressionAttributeValues[`:${key}`] = value;
            ExpressionAttributeNames[`#${key}`] = key;
            KeyConditionExpression.push(`#${key} = :${key}`)
        } else {
            ExpressionAttributeValues[`:${key}`] = value;
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

    // console.log("HERE:QUERY", JSON.stringify(initd, null, 2))

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
exports.query_simple = _.promise.denodeify(query_simple);
