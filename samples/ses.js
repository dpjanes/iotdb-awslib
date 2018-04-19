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
        .then(aws.ses.initialize)
        .then(_self => console.log("+", "ok"))
        .catch(error => console.log("#", _.error.message(error)))
}

if (action("send")) {
    _.promise.make({
        awsd: awsd,

        from: "david@consensas.com",
        to: "davidjanes@davidjanes.com",
        subject: "Test Message - メリークリスマス",
        document: "Hello, World - 明けましておめでとうございます",
    })
        .then(aws.initialize)
        .then(aws.ses.initialize)
        .then(aws.ses.send)
        .then(_self => console.log("+", "ok", _self.stream_name))
        .catch(error => console.log("#", _.error.message(error)))
}

if (action("send-html")) {
    _.promise.make({
        awsd: awsd,

        from: "david@consensas.com",
        tos: [ "davidjanes@davidjanes.com", "ryan@consensas.com", ],
        subject: "Test Message - メリークリスマス",
        document: "<p>Hello, World</p><p>明けましておめでとうございます</p>",
        document_media_type: "text/html",
    })
        .then(aws.initialize)
        .then(aws.ses.initialize)
        .then(aws.ses.send)
        .then(_self => console.log("+", "ok", _self.stream_name))
        .catch(error => console.log("#", _.error.message(error)))
}
