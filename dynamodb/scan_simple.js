/**
 *  dynamodb/scan_simple.js
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

const util = require("./util");

/**
 *  Accepts: 
 *  Produces:
 */
const scan_simple = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "dynamodb.scan_simple";

    assert.ok(self.dynamodb_client, `${method}: self.dynamodb is required`);
    assert.ok(_.is.String(self.table_name), `${method}: self.table_name must be a String`);
    assert.ok(_.is.JSON(self.query), `${method}: self.query must be a JSON-like object`);
    assert.ok(_.is.Array.of.String(self.query_attributes) || !self.query_attributes, 
        `${method}: self.query_attributes must be Null or an Array of String`);

    const FilterExpression = [];
    const ExpressionAttributeNames = {};
    const ExpressionAttributeValues = {};
    _.mapObject(self.query, (value, key) => {
        ExpressionAttributeValues[`:${key}`] = value;

        if (_.is.Number(value)) {
            ExpressionAttributeNames[`#${key}`] = key;
            FilterExpression.push(`#${key} = :${key}`)
        } else {
            FilterExpression.push(`${key} = :${key}`)
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
        FilterExpression: FilterExpression.join(" and "),
        ExpressionAttributeNames: _.is.Empty(ExpressionAttributeNames) ? null : ExpressionAttributeNames,
        ExpressionAttributeValues: ExpressionAttributeValues,
        ProjectionExpression: ProjectionExpression,
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
exports.scan_simple = Q.denodeify(scan_simple);
