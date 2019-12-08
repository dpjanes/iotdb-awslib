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

if (action("create-bucket")) {
    _.promise({
        awsd: awsd,
        bucket: ad.bucket || "consensas-test1",
    })
        .then(aws.initialize)
        .then(aws.s3.initialize)
        .log("A")
        .then(aws.s3.create_bucket)
        .log("B")
        .make(sd => console.log("+", "ok", sd.bucket_url)) // .result))
        .catch(_.error.log)
} else if (action("bucket-exists")) {
    _.promise({
        awsd: awsd,
        bucket: ad.bucket || "consensas-test1",
    })
        .then(aws.initialize)
        .then(aws.s3.initialize)
        .then(aws.s3.bucket_exists)
        .make(sd => console.log("+", "ok", sd.exists))
        .catch(_.error.log)
} else if (action("list-buckets")) {
    _.promise({
        awsd: awsd,
    })
        .then(aws.initialize)
        .then(aws.s3.initialize)
        .then(aws.s3.list_buckets)
        .make(sd => console.log("+", "ok", sd.buckets))
        .catch(_.error.log)
} else if (action("upload-json")) {
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
        .then(aws.s3.upload_json)
        .make(sd => console.log("+", "ok", sd.aws_result))
        .catch(_.error.log)
} else if (action("upload-document")) {
    _.promise({
        awsd: awsd,

        bucket: ad.bucket || "consensas-test1",
        key: "test.txt",
        document: "The quick brown fox jumped over the lazy dog",
    })
        .then(aws.initialize)
        .then(aws.s3.initialize)
        .then(aws.s3.upload_document)
        .make(sd => console.log("+", "ok", sd.aws_result))
        .catch(_.error.log)
} else if (action("delete-object")) {
    _.promise({
        awsd: awsd,

        bucket: ad.bucket || "consensas-test1",
        key: "test.txt",
    })
        .then(aws.initialize)
        .then(aws.s3.initialize)
        .then(aws.s3.delete_object)
        .make(sd => console.log("+", "ok", sd.aws_result))
        .catch(_.error.log)
} else if (action("list-objects")) {
    _.promise({
        awsd: awsd,
        bucket: ad.bucket || "consensas-test1",
        key: "eLyccgRz",
    })
        .then(aws.initialize)
        .then(aws.s3.initialize)
        .then(aws.s3.list_objects)
        .make(sd => console.log("+", "ok", sd.paths))
        .catch(_.error.log)
} else if (action("list-objects-recursive")) {
    _.promise({
        awsd: awsd,
        bucket: ad.bucket || "consensas-test1",
        key: "eLyccgRz",
    })
        .then(aws.initialize)
        .then(aws.s3.initialize)
        .then(aws.s3.list_objects.recursive)
        .make(sd => console.log("+", "ok", sd.paths))
        .catch(_.error.log)
} else if (action("head-object")) {
    _.promise({
        awsd: awsd,
        bucket: ad.bucket || "consensas-test1",
        key: ad.key || "name.jsonx",
    })
        .then(aws.initialize)
        .then(aws.s3.initialize)
        .then(aws.s3.head_object)
        .make(sd => console.log("+", "ok", sd.files))
        .catch(_.error.log)
} else if (action("object-exists")) {
    _.promise({
        awsd: awsd,
        bucket: ad.bucket || "consensas-test1",
        key: ad.key || "name.json",
    })
        .then(aws.initialize)
        .then(aws.s3.initialize)
        .then(aws.s3.object_exists)
        .make(sd => console.log("+", "ok", sd.exists))
        .catch(_.error.log)
} else if (action("object-exists-with-path")) {
    _.promise({
        awsd: awsd,
        path: "s3://consensas-test1/name.json",
    })
        .then(aws.initialize)
        .then(aws.s3.initialize)
        .then(aws.s3.parse_path)
        .then(aws.s3.exists)
        .make(sd => console.log("+", "ok", sd.exists))
        .catch(_.error.log)
} else if (!action_name) {
    console.log("#", "action required - should be one of:", actions.join(", "))
} else {
    console.log("#", "unknown action - should be one of:", actions.join(", "))
}

