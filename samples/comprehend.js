/**
 *  samples/comprehend.js
 *
 *  David Janes
 *  IOTDB
 *  2018-04-14
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict"

const _ = require("iotdb-helpers")
const fs = require("iotdb-fs")

const assert = require("assert")
const path = require("path")

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
        .then(aws.comprehend.initialize)
        .then(_.promise.make(sd => {
            console.log("+", "ok")
        }))
        .catch(error => {
            console.log("#", _.error.message(error))
        })
}

if (action("sentiment")) {
    _.promise.make({
        awsd: awsd,
        document: fs.fs.readFileSync(path.join(__dirname, "data", "bbc_congo.txt"), "utf-8"),
    })
        .then(aws.initialize)
        .then(aws.comprehend.initialize)
        .then(aws.comprehend.sentiment)
        .then(_.promise.make(sd => {
            console.log("+", "ok", sd.score)
        }))
        .catch(error => {
            console.log("#", _.error.message(error))
            delete error.self
            console.log(error)
        })
}
