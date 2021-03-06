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
const ad = minimist(process.argv.slice(2), {
    string: [
        "path",
    ],
    default: {
        "path": path.join(__dirname, "data", "bbc_congo.txt"),
    }
});

const action_name = ad._[0]

const actions = []
const action = name => {
    actions.push(name)

    return _normalize(action_name) === _normalize(name)
}

if (action("initialize")) {
    _.promise({
        aws$cfg: aws$cfg,
    })
        .then(aws.initialize)
        .then(aws.comprehend.initialize)
        .make(sd => {
            console.log("+", "ok")
        })
        .catch(error => {
            console.log("#", _.error.message(error))
        })
} else if (action("sentiment")) {
    _.promise({
        aws$cfg: aws$cfg,
        path: ad.path,
    })
        .then(fs.read.utf8)
        .then(aws.initialize)
        .then(aws.comprehend.initialize)
        .then(aws.comprehend.sentiment)
        .make(sd => {
            console.log("+", "ok", sd.token)
        })
        .catch(error => {
            console.log("#", _.error.message(error))
            delete error.self
            console.log(error)
        })
} else if (action("sentiment.batch")) {
    _.promise({
        aws$cfg: aws$cfg,
        path: ad.path,
        documents: [
            "John Smith called Lady MacBardle two times yesterday",
            "I love that new pair of shoes",
            "I hate Mondays",
        ],
    })
        .then(fs.read.utf8)
        .then(aws.initialize)
        .then(aws.comprehend.initialize)
        .then(aws.comprehend.sentiment.batch)
        .make(sd => {
            console.log("+", "ok", sd.tokens)
        })
        .catch(error => {
            console.log("#", _.error.message(error))
            delete error.self
            console.log(error)
        })
} else if (action("entities.batch")) {
    _.promise({
        aws$cfg: aws$cfg,
        documents: [
            "John Smith called Lady MacBardle two times yesterday",
            "See Spot run"
        ],
    })
        .then(aws.initialize)
        .then(aws.comprehend.initialize)
        .then(aws.comprehend.entities.batch)
        .make(sd => {
            console.log("+", "ok", sd.tokenss)
        })
        .catch(error => {
            console.log("#", _.error.message(error))
            delete error.self
            console.log(error)
        })
} else if (action("entities")) {
    _.promise({
        aws$cfg: aws$cfg,
        path: ad.path,
    })
        .then(fs.read.utf8)
        .then(aws.initialize)
        .then(aws.comprehend.initialize)
        .then(aws.comprehend.entities)
        .make(sd => {
            console.log("+", "ok", sd.tokens)
        })
        .catch(error => {
            console.log("#", _.error.message(error))
            delete error.self
            console.log(error)
        })
} else if (action("syntax.batch")) {
    _.promise({
        aws$cfg: aws$cfg,
        documents: [
            "John Smith called Lady MacBardle two times yesterday",
            "See Spot run"
        ],
    })
        .then(aws.initialize)
        .then(aws.comprehend.initialize)
        .then(aws.comprehend.syntax.batch)
        .make(sd => {
            console.log("+", "ok", sd.tokenss)
        })
        .catch(error => {
            console.log("#", _.error.message(error))
            delete error.self
            console.log(error)
        })
} else if (action("syntax")) {
    _.promise({
        aws$cfg: aws$cfg,
        path: ad.path,
    })
        .then(fs.read.utf8)
        .then(aws.initialize)
        .then(aws.comprehend.initialize)
        .then(aws.comprehend.syntax)
        .make(sd => {
            console.log("+", "ok", sd.tokens)
        })
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

