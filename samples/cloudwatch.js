/**
 *  test_cloudwatch.js
 *
 *  David Janes
 *  IOTDB
 *  2017-12-15
 *
 *  Copyright (2013-2018) David Janes
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

if (action("initialize")) {
    _.promise.make({
        aws$cfg: aws$cfg,
    })
        .then(aws.initialize)
        .then(aws.cloudwatch.initialize)
        .then(_.promise.make(sd => {
            console.log("+", "ok");
        }))
        .catch(handle)
}

if (action("log-groups")) {
    _.promise.make({
        aws$cfg: aws$cfg,
    })
        .then(aws.initialize)
        .then(aws.cloudwatch.initialize)
        .then(aws.cloudwatch.describe_log_groups)
        .then(_.promise.make(sd => {
            console.log("+", "ok", sd.log_groups);
        }))
        .catch(handle)
}


if (action("log-streams")) {
    _.promise.make({
        aws$cfg: aws$cfg,
        log_group: "website",
    })
        .then(aws.initialize)
        .then(aws.cloudwatch.initialize)
        .then(aws.cloudwatch.describe_log_streams)
        .then(_.promise.make(sd => {
            console.log("+", "ok", sd.log_stream_descriptions);
        }))
        .catch(handle)
}


if (action("log-events")) {
    _.promise.make({
        aws$cfg: aws$cfg,
        log_group: "website",
        log_stream: "2017/12/15/11/14/10",
    })
        .then(aws.initialize)
        .then(aws.cloudwatch.initialize)
        .then(aws.cloudwatch.get_log_events)
        .then(_.promise.make(sd => {
            console.log("+", "ok", sd.log_events);
        }))
        .catch(handle)
}

