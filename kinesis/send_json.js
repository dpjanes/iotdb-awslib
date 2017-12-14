/**
 *  kinesis/send_json.js
 *
 *  David Janes
 *  IOTDB
 *  2017-04-23
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

/**
 *  Accepts: self.kinesis, self.json, self.stream, self.partition_key
 *  Produces: N/A
 */
const send_json = _.promise.make((self, done) => {
    const method = "kinesis.send_json";

    assert.ok(self.kinesis, `${method}: self.kinesis is required`);
    assert.ok(_.is.JSON(self.json), `${method}: self.json must be JSON`);
    assert.ok(_.is.String(self.stream), `${method}: self.stream must be String`);
    assert.ok(_.is.Nullish(self.partition_key) || _.is.String(self.partition_key), 
        `${method}: self.partition_key must String or Null`);

    const params = {
        Data: JSON.stringify(self.json, null, 0),
        StreamName: self.stream,
    }

    if (self.partition_key) {
        params.PartitionKey = self.partition_key
    } else {
        params.PartitionKey = _.hash.md5(params.Data);
    }

    self.kinesis.putRecord(params, (error, data) => {
        if (error) {
            return done(error);
        }

        self.aws_result = data;

        done(null, self);
    })
})

/**
 *  API
 */
exports.send_json = send_json;
