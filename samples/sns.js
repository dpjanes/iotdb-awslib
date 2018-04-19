/**
 *  test_sns.js
 *
 *  David Janes
 *  IOTDB
 *  2017-07-11
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const AWS = require("aws-sdk");
const minimist = require('minimist');

const aws = require("../index");
const awsd = require("./aws.json")

const ad = minimist(process.argv.slice(2));

const action = (name) => ad._.indexOf(name) > -1;

if (action("initialize")) {
    _.promise.make({
        awsd: awsd,
    })
        .then(aws.initialize)
        .then(aws.sns.initialize)
        .then(_self => console.log("+", "ok"))
        .catch(error => console.log("#", _.error.message(error)))
}

if (action("publish")) {
    _.promise.make({
        awsd: awsd,
        json: {
            "default": _.timestamp.make(),
        },
        to_topic: "arn:aws:sns:us-east-1:061177153071:test-1",
    })
        .then(aws.initialize)
        .then(aws.sns.initialize)
        .then(aws.sns.publish)
        .then(_self => console.log("+", "ok", JSON.stringify(_self.aws_result, null, 2)))
        .catch(error => console.log("#", _.error.message(error)))
}

if (action("sms")) {
    assert(ad._.length > 1, "a phone number argument is required")

    _.promise.make({
        awsd: awsd,
        document: _.timestamp.make(),
        to_phone: `${ad._[1]}`,
    })
        .then(aws.initialize)
        .then(aws.sns.initialize)
        .then(aws.sns.publish_sms)
        .then(_self => console.log("+", "ok", JSON.stringify(_self.aws_result, null, 2)))
        .catch(error => console.log("#", _.error.message(error)))
}
