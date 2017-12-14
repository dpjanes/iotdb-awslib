/**
 *  kinesis/get_jsons.js
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

const aws = {
    kinesis: {
        describe_stream: require("./describe_stream").describe_stream,
        get_records: require("./get_records").get_records,
        get_shard_iterator: require("./get_shard_iterator").get_shard_iterator,
    },
}

/**
 */
const _get_shard_iterator = _.promise.make((self, done) => {
    const method = "kinesis.get_jsons/_get_shard_iterator";

    assert.ok(self.shard_description, `${method}: expected self.shard_description`);

    _.promise.make(self)
        .then(_.promise.add("shard", self.shard_description.ShardId))
        .then(aws.kinesis.get_shard_iterator)
        .then(_.promise.done(done))
        .catch(done)
})

/**
 *  This will get a shard_iterator for every shard.
 *  If there's already ones (in pager), we'll just use that
 */
const _get_shard_iterators = _.promise.make((self, done) => {
    const method = "kinesis.get_jsons/_get_shard_iterators";

    if (self.pager) {
        self.shard_iterators = self.pager.split(",")

        return done(null, self);
    }

    assert.ok(self.stream, `${method}: expected self.stream`);

    _.promise.make(self)
        .then(aws.kinesis.describe_stream)
        .then(_.promise.series({
            method: _get_shard_iterator,
            inputs: "stream_description/Shards:shard_description",
            output_selector: sd => sd.shard_iterator,
            outputs: "shard_iterators",
        }))
        .then(_.promise.done(done, self, "shard_iterators"))
        .catch(done)
})

/**
 *  Accepts: self.kinesis, self.stream_description, self
 *  Produces: self.jsons
 */
const get_jsons = _.promise.make((self, done) => {
    const method = "kinesis.get_jsons";

    assert.ok(self.kinesis, `${method}: self.kinesis is required`);
    assert.ok(self.stream, `${method}: self.stream is required`);

    _.promise.make(self)
        .then(_get_shard_iterators)
        .then(_.promise.series({
            method: aws.kinesis.get_records,
            inputs: "shard_iterators:shard_iterator",
        }))
        .then(_.promise.make(sd => {
            sd.jsons = [];

            const shard_iterators = [];
            
            sd.outputs.forEach(output => {
                output.records.forEach(record => {
                    sd.jsons.push(JSON.parse(record.Data.toString()))
                })

                shard_iterators.push(output.shard_iterator)
            })

            sd.cursor = {
                next: shard_iterators.join(","),
            }
        }))
        .then(_.promise.done(done, self, "jsons,cursor"))
        .catch(done)
})

/**
 *  API
 */
exports.get_jsons = get_jsons;

/*
exports.get_jsons.latest = 
exports.get_jsons.trim_horizon = 
exports.get_jsons.oldest = 
exports.get_jsons.at_sequence = sequence => 
exports.get_jsons.after_sequence = sequence => 
exports.get_jsons.at_timestamp = timestamp => 
*/
