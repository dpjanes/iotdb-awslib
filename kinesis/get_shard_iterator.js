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
const get_shard_iterator = (type, sequence, timestamp) => _.promise.make((self, done) => {
    const method = "kinesis.get_shard_iterator";

    assert.ok(self.kinesis, `${method}: self.kinesis is required`);
    assert.ok(_.is.String(self.stream), `${method}: self.stream is required`);
    assert.ok(self.shard, `${method}: self.shard is required`);

    const params = {
        StreamName: self.stream,
        ShardId: self.shard,
        ShardIteratorType: type,
    }

    if (sequence) {
        params.StartingSequenceNumber = sequence;
    }
    if (timestamp) {
        params.Timestamp = timestamp;
    }

    self.kinesis.getShardIterator(params, (error, data) => {
        if (error) {
            return done(error);
        }

        self.aws_result = data;
        self.shard_iterator = data.ShardIterator;

        done(null, self);
    })
})

const parameterized = (shard_iterator_type, starting_sequence_number, timestamp) => self => {
    _.promise.make(self)
        .then(_.promise.add({
            shard_iterator_type: shard_iterator_type || self.shard_iterator_type,
            starting_sequence_number: starting_sequence_number || self.starting_sequence_number,
            timestamp: timestamp || self.timestamp,
        }))
        .then(get_shard_iterator)
        .then(_.promise.done(done, self, "aws_result,shard_iterator"))
        .catch(done)
}


/**
 *  API
 */
exports.get_shard_iterator = get_shard_iterator("LATEST");
exports.get_shard_iterator.latest = parameterized("LATEST");
exports.get_shard_iterator.trim_horizon = parameterized("TRIM_HORIZON");
exports.get_shard_iterator.oldest = parameterized("TRIM_HORIZON");
exports.get_shard_iterator.at_sequence = sequence => parameterized("at_sequence", sequence);
exports.get_shard_iterator.after_sequence = sequence => parameterized("after_sequence", sequence);
exports.get_shard_iterator.at_timestamp = timestamp => parameterized("AT_TIMESTAMP", null, timestamp);
