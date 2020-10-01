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
const config = require("./aws.json")
const aws$cfg = config.aws$cfg

const _normalize = s => (s || "").replace(/-/g, "_")
const ad = minimist(process.argv.slice(2));
const action_name = ad._[0]

const actions = []
const action = name => {
    actions.push(name)

    return _normalize(action_name) === _normalize(name)
}

if (action("initialize")) {
    _.promise.make({
        aws$cfg: aws$cfg,
    })
        .then(aws.initialize)
        .then(aws.comprehend.initialize)
        .then(_.promise.make(sd => {
            console.log("+", "ok")
        }))
        .catch(error => {
            console.log("#", _.error.message(error))
        })
} else if (action("sentiment")) {
    _.promise.make({
        aws$cfg: aws$cfg,
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
} else if (action("entities")) {
    _.promise.make({
        aws$cfg: aws$cfg,
        document: fs.fs.readFileSync(path.join(__dirname, "data", "bbc_congo.txt"), "utf-8"),
    })
        .then(aws.initialize)
        .then(aws.comprehend.initialize)
        .then(aws.comprehend.entities)
        .then(_.promise.make(sd => {
            console.log("+", "ok", sd.entities)
        }))
        .catch(error => {
            console.log("#", _.error.message(error))
            delete error.self
            console.log(error)
        })
} else if (action("syntax")) {
    _.promise.make({
        aws$cfg: aws$cfg,
        document: fs.fs.readFileSync(path.join(__dirname, "data", "bbc_congo.txt"), "utf-8"),
    })
        .then(aws.initialize)
        .then(aws.comprehend.initialize)
        .then(aws.comprehend.syntax)
        .then(_.promise.make(sd => {
            console.log("+", "ok", sd.tokens)
        }))
        .catch(error => {
            console.log("#", _.error.message(error))
            delete error.self
            console.log(error)
        })
} else if (!action_name) {
    console.log("#", "action required - should be one of:", actions.join(", "))
} else {
    console.log("#", "unknown action - should be one of:", actions.join(", "))
}

