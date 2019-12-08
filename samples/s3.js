/**
 *  test_s3.js
 *
 *  David Janes
 *  IOTDB
 *  2017-01-18
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict"

const _ = require("iotdb-helpers")

const assert = require("assert")

const AWS = require("aws-sdk")
const minimist = require('minimist')

const aws = require("../index")
const config = require("./aws.json")
const awsd = config.awsd

const ad = minimist(process.argv.slice(2))
const action_name = ad._[0]

const actions = []
const action = name => {
    actions.push(name)

    return action_name === name
}

if (action("bucket.create")) {
    _.promise({
        awsd: awsd,
        bucket: ad.bucket || "consensas-test1",
    })
        .then(aws.initialize)
        .then(aws.s3.initialize)
        .then(aws.s3.bucket.create)
        .make(sd => console.log("+", "ok", sd.bucket_url)) // .result))
        .catch(_.error.log)
} else if (action("bucket.exists")) {
    _.promise({
        awsd: awsd,
        bucket: ad.bucket || "consensas-test1",
    })
        .then(aws.initialize)
        .then(aws.s3.initialize)
        .then(aws.s3.bucket.exists)
        .make(sd => console.log("+", "ok", sd.exists))
        .catch(_.error.log)
} else if (action("bucket.list")) {
    _.promise({
        awsd: awsd,
    })
        .then(aws.initialize)
        .then(aws.s3.initialize)
        .then(aws.s3.bucket.list)
        .make(sd => console.log("+", "ok", sd.buckets))
        .catch(_.error.log)
} else if (action("json.put")) {
    _.promise({
        awsd: awsd,

        bucket: ad.bucket || "consensas-test1",
        key: ad.key || "name.json",
        json: {
            "hello": "world",
        },
    })
        .then(aws.initialize)
        .then(aws.s3.initialize)
        .then(aws.s3.json.put)
        .make(sd => console.log("+", "ok", sd.aws$result))
        .catch(_.error.log)
} else if (action("object.put")) {
    _.promise({
        awsd: awsd,

        bucket: ad.bucket || "consensas-test1",
        key: "test.txt",
        document: "The quick brown fox jumped over the lazy dog",
    })
        .then(aws.initialize)
        .then(aws.s3.initialize)
        .then(aws.s3.object.put)
        .make(sd => console.log("+", "ok", sd.aws$result))
        .catch(_.error.log)
} else if (action("object.delete")) {
    _.promise({
        awsd: awsd,

        bucket: ad.bucket || "consensas-test1",
        key: "test.txt",
    })
        .then(aws.initialize)
        .then(aws.s3.initialize)
        .then(aws.s3.object.delete)
        .make(sd => console.log("+", "ok", sd.aws$result))
        .catch(_.error.log)
} else if (action("object.list")) {
    _.promise({
        awsd: awsd,
        bucket: ad.bucket || "consensas-test1",
        // key: "eLyccgRz",
    })
        .then(aws.initialize)
        .then(aws.s3.initialize)
        .then(aws.s3.object.list)
        .make(sd => console.log("+", "keys", sd.keys))
        .then(aws.s3.path.build.all)
        .make(sd => console.log("+", "paths", sd.paths))
        .catch(_.error.log)
} else if (action("object.list.recursive")) {
    _.promise({
        awsd: awsd,
        bucket: ad.bucket || "consensas-test1",
        // key: "eLyccgRz",
    })
        .then(aws.initialize)
        .then(aws.s3.initialize)
        .then(aws.s3.object.list.recursive)
        .make(sd => console.log("+", "keys", sd.keys))
        .then(aws.s3.path.build.all)
        .make(sd => console.log("+", "ok", sd.paths))
        .catch(_.error.log)
} else if (action("object.head")) {
    _.promise({
        awsd: awsd,
        bucket: ad.bucket || "consensas-test1",
        key: ad.key || "name.jsonx",
    })
        .then(aws.initialize)
        .then(aws.s3.initialize)
        .then(aws.s3.object.head)
        .make(sd => console.log("+", "media_type", sd.document_media_type))
        .make(sd => console.log("+", "length", sd.document_length))
        .make(sd => console.log("+", "ok", sd.aws$result))
        .catch(_.error.log)
} else if (action("object.exists")) {
    _.promise({
        awsd: awsd,
        bucket: ad.bucket || "consensas-test1",
        key: ad.key || "name.json",
    })
        .then(aws.initialize)
        .then(aws.s3.initialize)
        .then(aws.s3.object.exists)
        .make(sd => console.log("+", "ok", sd.exists))
        .catch(_.error.log)
} else if (action("object.exists-path")) {
    _.promise({
        awsd: awsd,
        path: "s3://consensas-test1/name.json",
    })
        .then(aws.initialize)
        .then(aws.s3.initialize)
        .then(aws.s3.path.parse)
        .then(aws.s3.object.exists)
        .make(sd => console.log("+", "ok", sd.exists))
        .catch(_.error.log)
} else if (!action_name) {
    console.log("#", "action required - should be one of:", actions.join(", "))
} else {
    console.log("#", "unknown action - should be one of:", actions.join(", "))
}

