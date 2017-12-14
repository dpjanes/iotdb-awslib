/**
 *  kinesis/get_shard_iterator.js
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

/**
 *  Accepts: self.kinesis, self.stream
 *  Produces: self.streams
 */
const get_shard_iterator = _.promise.make((self, done) => {
    const method = "kinesis.get_shard_iterator";

    assert.ok(self.kinesis, `${method}: self.kinesis is required`);
    assert.ok(_.is.String(self.stream), `${method}: self.stream is required`);
    assert.ok(self.shard, `${method}: self.shard is required`);

    self.kinesis.getShardIterator({
        StreamName: self.stream,
        ShardId: self.shard,
        ShardIteratorType: "TRIM_HORIZON",
        // ShardIteratorType: "LATEST",
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        self.aws_result = data;
        self.shard_iterator = data.ShardIterator;

        done(null, self);
    })
})

/**
 *  API
 */
exports.get_shard_iterator = get_shard_iterator;
