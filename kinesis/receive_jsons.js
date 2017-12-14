/**
 *  kinesis/receive_jsons.js
 *
 *  David Janes
 *  IOTDB
 *  2017-12-14
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const _fetch_shard = _.promise.make((self, done) => {
})

/**
 *  Accepts: self.kinesis, self.stream_description, self
 *  Produces: self.jsons
 */
const receive_jsons = _.promise.make((self, done) => {
    const method = "kinesis.receive_jsons";

    assert.ok(self.kinesis, `${method}: self.kinesis is required`);
    assert.ok(self.stream_description, `${method}: self.stream_description is required`);

    _.promise.make(self)
        .then(_.promise.series({
            method: _fetch_shard,
            inputs: "stream_description/Shards:shard",
            output_selector: 
        }))
})

/**
 *  API
 */
exports.receive_jsons = receive_jsons;
