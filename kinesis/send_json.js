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

const Q = require("q");

/**
 *  Accepts: self.kinesis, self.json, self.stream_name, self.partition_key
 *  Produces: N/A
 */
const send_json = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "kinesis.send_json";

    assert.ok(self.kinesis, `${method}: self.kinesis is required`);
    assert.ok(_.is.JSON(self.json), `${method}: self.json must be a JSONable Object`);
    assert.ok(_.is.String(self.stream_name), `${method}: self.stream_name is required`);
    assert.ok(_.is.String(self.partition_key), `${method}: self.partition_key is required`);


    self.kinesis.putRecord({
        Data: JSON.stringify(self.json, null, 0),
        PartitionKey: self.partition_key,
        StreamName: self.stream_name,
    }, (error, data) => {
        if (error) {
            return error(error);
        }

        done(null, self);
    })
}

/**
 *  API
 */
exports.send_json = Q.denodeify(send_json);
