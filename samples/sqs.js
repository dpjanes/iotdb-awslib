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
const Q = require("q");
const minimist = require('minimist');

const aws = require("../index");
const awsd = {
    profile: "consensas",
    region: "us-east-1",
}

const ad = minimist(process.argv.slice(2));

const action = (name) => ad._.indexOf(name) > -1;

if (action("initialize")) {
    Q({
        aws: awsd,
    })
        .then(aws.initialize)
        .then(aws.sqs.initialize)
        .then(_self => console.log("+", "ok"))
        .catch(error => console.log("#", _.error.message(error)))
}

if (action("list-queues")) {
    Q({
        aws: awsd,
    })
        .then(aws.initialize)
        .then(aws.sqs.initialize)
        .then(aws.sqs.list_queues)
        .then(_self => console.log("+", "ok", _self.queue_urls))
        .catch(error => console.log("#", _.error.message(error)))
}

if (action("get-queue-url")) {
    Q({
        aws: awsd,
        queue_name: "test1",
    })
        .then(aws.initialize)
        .then(aws.sqs.initialize)
        .then(aws.sqs.get_queue_url)
        .then(_self => console.log("+", "ok", _self.queue_url))
        .catch(error => console.log("#", _.error.message(error)))
}
