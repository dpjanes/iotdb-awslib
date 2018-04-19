/**
 *  test_sqs.js
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
const config = require("./aws.json")
const awsd = config.awsd

const ad = minimist(process.argv.slice(2));

const action = (name) => ad._.indexOf(name) > -1;

if (action("initialize")) {
    _.promise.make({
        awsd: awsd,
    })
        .then(aws.initialize)
        .then(aws.sqs.initialize)
        .then(_self => console.log("+", "ok"))
        .catch(error => console.log("#", _.error.message(error)))
}

if (action("list-queues")) {
    _.promise.make({
        aws: awsd,
    })
        .then(aws.initialize)
        .then(aws.sqs.initialize)
        .then(aws.sqs.list_queues)
        .then(_self => console.log("+", "ok", _self.queue_urls))
        .catch(error => console.log("#", _.error.message(error)))
}

if (action("get-queue-url")) {
    _.promise.make({
        aws: awsd,
        queue_name: "test1",
    })
        .then(aws.initialize)
        .then(aws.sqs.initialize)
        .then(aws.sqs.get_queue_url)
        .then(_self => console.log("+", "ok", _self.queue_url))
        .catch(error => console.log("#", _.error.message(error)))
}

if (action("send-json")) {
    _.promise.make({
        aws: awsd,
        queue_name: "test1",
        json: _.timestamp.add({ "a": "Message", "ledger_id": "urn:iotdb:ledger:ZBm22eUo" }),
    })
        .then(aws.initialize)
        .then(aws.sqs.initialize)
        .then(aws.sqs.get_queue_url)
        .then(aws.sqs.send_json)
        .then(_self => console.log("+", "ok", _self.queue_url))
        .catch(error => console.log("#", _.error.message(error)))
}

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
        .then(aws.sqs.initialize)
        .then(aws.sqs.get_queue_url)
        .then(aws.sqs.process_json)
        .then(_self => console.log("+", "ok", _self.queue_url))
        .catch(error => console.log("#", _.error.message(error)))
}
