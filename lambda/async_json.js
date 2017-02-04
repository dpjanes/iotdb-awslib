/**
 *  lambda/async_json.js
 *
 *  David Janes
 *  IOTDB
 *  2017-02-04
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
const async_json = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "lambda.async_json";

    assert.ok(self.lambda, `${method}: self.lambda is required`);
    assert.ok(_.is.JSON(self.json), `${method}: self.json is required to be JSON-like object`);
    assert.ok(_.is.String(self.function_name), `${method}: self.function_name must be a String`);

    self.lambda.invoke({
        FunctionName: self.function_name,
        Payload: JSON.stringify(self.json, null, 0),
        InvocationType: "Event",
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        self.queue_url = data.QueueUrl;

        return done(null, self);
    });
}

/**
 *  API
 */
exports.async_json = Q.denodeify(async_json);
