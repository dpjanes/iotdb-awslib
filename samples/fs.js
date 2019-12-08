/**
 *  samples/fs.js
 *
 *  David Janes
 *  IOTDB
 *  2018-04-19
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict"

const _ = require("iotdb-helpers")

const assert = require("assert")

const AWS = require("aws-sdk")
const minimist = require("minimist")

const aws = require("../index")
const config = require("./aws.json")
const aws$cfg = config.aws$cfg

const ad = minimist(process.argv.slice(2))

const action = (name) => ad._.indexOf(name) > -1

const default_bucket = ad.path || `s3://${config.bucket}/`
const default_path = ad.path || `s3://${config.bucket}/`

if (action("list")) {
    _.promise.make({
        aws$cfg: aws$cfg,
        path: default_path,
    })
        .then(aws.initialize)
        .then(aws.s3.initialize)
        .then(aws.s3.fs.list)
        .then(_.promise.make(sd => {
            console.log("+", "ok", sd.paths)
        }))
        .catch(error => console.log("#", _.error.message(error)))
}

if (action("list-recursive")) {
    _.promise.make({
        aws$cfg: aws$cfg,
        path: default_path,
    })
        .then(aws.initialize)
        .then(aws.s3.initialize)
        .then(aws.s3.fs.list.recursive)
        .then(_.promise.make(sd => {
            console.log("+", "ok", sd.paths)
        }))
        .catch(error => console.log("#", _.error.message(error)))
}

if (action("write")) {
    _.promise.make({
        aws$cfg: aws$cfg,
    })
        .then(aws.initialize)
        .then(aws.s3.initialize)
        .then(aws.s3.fs.write.p(aws.s3.fs.join(default_bucket, "somefile.txt"), "a document", "utf-8"))
        .then(aws.s3.fs.list.p(default_bucket))
        .then(_.promise.make(sd => {
            console.log("+", "ok", sd.paths)
        }))
        .catch(error => console.log("#", _.error.message(error)))
}

if (action("remove")) {
    _.promise.make({
        aws$cfg: aws$cfg,
    })
        .then(aws.initialize)
        .then(aws.s3.initialize)
        .then(aws.s3.fs.write.p(aws.s3.fs.join(default_bucket, "somefile.txt"), "a document", "utf-8"))
        .then(aws.s3.fs.list.p(default_bucket))
        .then(_.promise.make(sd => {
            console.log("-", "paths", sd.paths)
        }))
        .then(aws.s3.fs.remove.p(aws.s3.fs.join(default_bucket, "somefile.txt")))
        .then(aws.s3.fs.list.p(default_bucket))
        .then(_.promise.make(sd => {
            console.log("+", "ok", sd.paths)
        }))
        .catch(error => console.log("#", _.error.message(error)))
}
