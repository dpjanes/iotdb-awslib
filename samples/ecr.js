/**
 *  samples/ecr.js
 *
 *  David Janes
 *  IOTDB
 *  2018-06-22
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
const config = require("./aws.json")
const awsd = config.awsd

const _normalize = s => s.replace(/-/g, "_")
const ad = minimist(process.argv.slice(2));
ad._ = ad._.map(_normalize)

const action = name => ad._.indexOf(_normalize(name)) > -1;

if (action("initialize")) {
    _.promise.make({
        awsd: awsd,
    })
        .then(aws.initialize)
        .then(aws.ecr.initialize)
        .then(_.promise.make(sd => {
            console.log("+", "ok")
        }))
        .catch(error => {
            console.log("#", _.error.message(error))
        })
}

if (action("repository.list")) {
    _.promise.make({
        awsd: awsd,
    })
        .then(aws.initialize)
        .then(aws.ecr.initialize)
        .then(aws.ecr.repository.list)
        .then(_.promise.make(sd => {
            console.log("+", "ok", sd.repositories)
        }))
        .catch(error => {
            console.log("#", _.error.message(error))
        })
}

if (action("repository.get_by_name")) {
    _.promise.make({
        awsd: awsd,
        name: "consensas/redis",
    })
        .then(aws.initialize)
        .then(aws.ecr.initialize)
        .then(aws.ecr.repository.get_by_name)
        .then(_.promise.make(sd => {
            console.log("+", "ok", sd.repository)
        }))
        .catch(error => {
            console.log("#", _.error.message(error))
        })
}

if (action("repository.create")) {
    _.promise.make({
        awsd: awsd,
        name: "consensas/test-xxx",
    })
        .then(aws.initialize)
        .then(aws.ecr.initialize)
        .then(aws.ecr.repository.create)
        .then(_.promise.make(sd => {
            console.log("+", "ok", sd.repository)
        }))
        .catch(error => {
            console.log("#", _.error.message(error))
        })
}

if (action("repository.delete")) {
    _.promise.make({
        awsd: awsd,
        name: "consensas/test-xxx",
    })
        .then(aws.initialize)
        .then(aws.ecr.initialize)
        .then(aws.ecr.repository.delete)
        .then(_.promise.make(sd => {
            console.log("+", "ok", sd.repository)
        }))
        .catch(error => {
            console.log("#", _.error.message(error))
        })
}
