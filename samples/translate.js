/**
 *  samples/translate.js
 *
 *  David Janes
 *  IOTDB
 *  2018-04-14
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict"

const _ = require("iotdb-helpers")

const assert = require("assert")

const AWS = require("aws-sdk")
const minimist = require('minimist')

const aws = require("../index")
const awsd = {
    profile: "consensas",
    region: "us-east-1",
}

const _normalize = s => s.replace(/-/g, "_")
const ad = minimist(process.argv.slice(2));
ad._ = ad._.map(_normalize)

const action = name => ad._.indexOf(_normalize(name)) > -1;

if (action("initialize")) {
    _.promise.make({
        awsd: awsd,
    })
        .then(aws.initialize)
        .then(aws.translate.initialize)
        .then(_.promise.make(sd => {
            console.log("+", "ok")
        }))
        .catch(error => {
            console.log("#", _.error.message(error))
        })
}

if (action("translate")) {
    _.promise.make({
        awsd: awsd,
        document: "Hello, World",
        to_language: "zh",
    })
        .then(aws.initialize)
        .then(aws.translate.initialize)
        .then(aws.translate.translate)
        .then(_.promise.make(sd => {
            console.log("+", "ok", sd.document)
        }))
        .catch(error => {
            console.log("#", _.error.message(error))
            delete error.self
            console.log(error)
        })
}
