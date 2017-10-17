/**
 *  lambda/invoke.js
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

/**
 *  Accepts: 
 *  Produces:
 */
const invoke = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "lambda.invoke";

    assert.ok(self.lambda, `${method}: self.lambda is required`);
    assert.ok(_.is.String(self.function_name), `${method}: self.function_name must be a String`);

    self.lambda.invoke({
        FunctionName: self.function_name,
        // ...
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
exports.invoke = _.promise.denodeify(invoke);
