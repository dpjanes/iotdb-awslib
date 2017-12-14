/**
 *  kinesis/get_records.js
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
const get_records = _.promise.make((self, done) => {
    const method = "kinesis.get_records";

    assert.ok(self.kinesis, `${method}: self.kinesis is required`);
    assert.ok(_.is.String(self.shard_iterator), `${method}: self.shard_iterator is required`);

    self.kinesis.getRecords({
        ShardIterator: self.shard_iterator,
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        self.aws_result = data;
        self.records = data.Records;
        self.shard_iterator = data.NextShardIterator;

        done(null, self);
    })
})

/**
 *  API
 */
exports.get_records = get_records;
