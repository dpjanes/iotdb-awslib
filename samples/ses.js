/**
 *  test_ses.js
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
const Q = require("bluebird-q");
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
        awsd: awsd,
    })
        .then(aws.initialize)
        .then(aws.ses.initialize)
        .then(_self => console.log("+", "ok"))
        .catch(error => console.log("#", _.error.message(error)))
}

if (action("send")) {
    Q({
        awsd: awsd,

        from: "davidjanes@gmail.com",
        to: "davidjanes@davidjanes.com",
        subject: "Test Message",
        document: "Hello, World",
    })
        .then(aws.initialize)
        .then(aws.ses.initialize)
        .then(aws.ses.send)
        .then(_self => console.log("+", "ok", _self.stream_name))
        .catch(error => console.log("#", _.error.message(error)))
}
