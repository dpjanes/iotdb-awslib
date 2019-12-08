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
const config = require("./aws.json")
const aws$cfg = config.aws$cfg

const ad = minimist(process.argv.slice(2));

const action = (name) => ad._.indexOf(name) > -1;

const handle = error => {
    console.log("#", _.error.message(error));

    delete error.self;
    console.log(error)
}

const STREAM = "unified-logs";
const SHARD = "shardId-000000000000";

if (action("initialize")) {
    _.promise.make({
        aws$cfg: aws$cfg,
    })
        .then(aws.initialize)
        .then(aws.kinesis.initialize)
        .then(_.promise.make(sd => {
            console.log("+", "ok");
        }))
        .catch(handle)
}

if (action("list-streams")) {
    _.promise.make({
        aws$cfg: aws$cfg,
    })
        .then(aws.initialize)
        .then(aws.kinesis.initialize)
        .then(aws.kinesis.list_streams)
        .then(_.promise.make(sd => {
            console.log("+", "ok", sd.streams)
        }))
        .catch(handle)
}

if (action("describe-stream")) {
    _.promise.make({
        aws$cfg: aws$cfg,
        stream: STREAM,
    })
        .then(aws.initialize)
        .then(aws.kinesis.initialize)
        .then(aws.kinesis.describe_stream)
        .then(_.promise.make(sd => {
            console.log("+", "ok", sd.stream_description)
        }))
        .catch(handle)
}

if (action("send-json")) {
    _.promise.make({
        aws$cfg: aws$cfg,
        stream: STREAM,
        json: _.timestamp.add({ "a": "Message", "ledger_id": "urn:iotdb:ledger:ZBm22eUo" }),
    })
        .then(aws.initialize)
        .then(aws.kinesis.initialize)
        .then(aws.kinesis.send_json)
        .then(_.promise.make(sd => {
            console.log("+", "ok");
        }))
        .catch(handle)
}

if (action("get-shard-iterator")) {
    _.promise.make({
        aws$cfg: aws$cfg,
        stream: STREAM,
        shard: SHARD,
    })
        .then(aws.initialize)
        .then(aws.kinesis.initialize)
        .then(aws.kinesis.get_shard_iterator)
        .then(_.promise.make(sd => {
            console.log("+", "ok", sd.shard_iterator);
            console.log("+", "ok", sd.aws_result);
        }))
        .catch(handle)
}

if (action("get-records")) {
    _.promise.make({
        aws$cfg: aws$cfg,
        stream: STREAM,
        shard: SHARD,
    })
        .then(aws.initialize)
        .then(aws.kinesis.initialize)
        .then(aws.kinesis.get_shard_iterator)
        .then(aws.kinesis.get_records)
        .then(_.promise.make(sd => {
            console.log("+", "ok", sd.records)
            console.log("+", "ok", sd.shard_iterator)
        }))
        .catch(handle)
}


if (action("get-jsons")) {
    const fetch = pager => {
        _.promise.make({
            aws$cfg: aws$cfg,
            stream: STREAM,
            pager: pager,
        })
            .then(aws.initialize)
            .then(aws.kinesis.initialize)
            .then(aws.kinesis.get_jsons)
            .then(_.promise.make(sd => {
                console.log("----")
                console.log("+", "ok", "jsons", sd.jsons)
                console.log("+", "ok", "cursor", sd.cursor)

                setTimeout(() => fetch(sd.cursor.next), 10 * 1000)
            }))
            .catch(handle)
    }

    fetch(null)
}

if (action("get-jsons-all")) {
    _.promise.make({
        aws$cfg: aws$cfg,
        stream: STREAM,
    })
        .then(aws.initialize)
        .then(aws.kinesis.initialize)
        .then(aws.kinesis.get_jsons.oldest)
        .then(_.promise.make(sd => {
            console.log("+", "ok", "jsons", sd.jsons)
        }))
        .catch(handle)
}

