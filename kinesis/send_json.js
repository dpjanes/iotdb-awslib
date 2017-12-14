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
    assert.ok(_.is.JSON(self.json), `${method}: self.json must be a JSONable Object`);
    assert.ok(_.is.String(self.stream), `${method}: self.stream is required`);
    assert.ok(_.is.String(self.partition_key), `${method}: self.partition_key is required`);

    self.kinesis.putRecord({
        Data: JSON.stringify(self.json, null, 0),
        PartitionKey: self.partition_key,
        StreamName: self.stream,
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        done(null, self);
    })
})

/**
 *  API
 */
exports.send_json = send_json;
