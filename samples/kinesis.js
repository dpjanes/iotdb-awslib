/**
 *  test_kinesis.js
 *
 *  David Janes
 *  IOTDB
 *  2017-01-29
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const AWS = require("aws-sdk");
const minimist = require('minimist');

const aws = require("../index");
const awsd = {
    profile: "consensas",
    region: "us-east-1",
}

const ad = minimist(process.argv.slice(2));

const action = (name) => ad._.indexOf(name) > -1;

const handle = error => {
    console.log("#", _.error.message(error));
}

if (action("initialize")) {
    _.promise.make({
        awsd: awsd,
    })
        .then(aws.initialize)
        .then(aws.kinesis.initialize)
        .then(_self => console.log("+", "ok"))
        .catch(handle)
}

if (action("list-streams")) {
    _.promise.make({
        awsd: awsd,
    })
        .then(aws.initialize)
        .then(aws.kinesis.initialize)
        .then(aws.kinesis.list_streams)
        .then(_.promise.make(sd => {
            console.log("+", "ok", sd.stream_names)
        }))
        .catch(handle)
}

if (action("describe-stream")) {
    _.promise.make({
        awsd: awsd,
        stream_name: "unified-logs",
    })
        .then(aws.initialize)
        .then(aws.kinesis.initialize)
        .then(aws.kinesis.describe_stream)
        .then(_.promise.make(sd => {
            console.log("+", "ok", sd.stream)
        }))
        .catch(handle)
}

/*
if (action("list-queues")) {
    _.promise.make({
        aws: awsd,
    })
        .then(aws.initialize)
        .then(aws.kinesis.initialize)
        .then(aws.kinesis.list_queues)
        .then(_self => console.log("+", "ok", _self.queue_urls))
        .catch(error => console.log("#", _.error.message(error)))
}

if (action("get-queue-url")) {
    _.promise.make({
        aws: awsd,
        queue_name: "test1",
    })
        .then(aws.initialize)
        .then(aws.kinesis.initialize)
        .then(aws.kinesis.get_queue_url)
        .then(_self => console.log("+", "ok", _self.queue_url))
        .catch(error => console.log("#", _.error.message(error)))
}
*/

if (action("send-json")) {
    _.promise.make({
        aws: awsd,
        stream_name: "ledgers",
        json: _.timestamp.add({ "a": "Message", "ledger_id": "urn:iotdb:ledger:ZBm22eUo" }),
        partition_key: "urn:iotdb:ledger:ZBm22eUo",
    })
        .then(aws.initialize)
        .then(aws.kinesis.initialize)
        .then(aws.kinesis.send_json)
        .then(_self => console.log("+", "ok", _self.stream_name))
        .catch(error => console.log("#", _.error.message(error)))
}

/*
if (action("process-json")) {
    _.promise.make({
        aws: awsd,
        queue_name: "test1",
        handle_message: _.promise.denodeify((_self, done) => {
            console.log("+", "MESSAGE", JSON.stringify(_self.json, null, 2));
            done(null, _self);
        }),
        handle_error: error => {
            console.log("#", "error", _.error.message(error));
        },
        handle_failure: error => {
            console.log("#", "FAILURE", _.error.message(error));
        },
    })
        .then(aws.initialize)
        .then(aws.kinesis.initialize)
        .then(aws.kinesis.get_queue_url)
        .then(aws.kinesis.process_json)
        .then(_self => console.log("+", "ok", _self.queue_url))
        .catch(error => console.log("#", _.error.message(error)))
}
*/
