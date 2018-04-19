/**
 *  test_s3.js
 *
 *  David Janes
 *  IOTDB
 *  2017-01-18
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

// create bucket
if (action("create-bucket")) {
    _.promise.make({
        awsd: awsd,
        bucket: "consensas-test1",
    })
        .then(aws.initialize)
        .then(aws.s3.initialize)
        .then(aws.s3.create_bucket)
        .then(_self => console.log("+", "ok", _self.bucket_url)) // .result))
        .catch(error => console.log("#", _.error.message(error)))
}

// list buckets
if (action("list-buckets")) {
    _.promise.make({
        awsd: awsd,
    })
        .then(aws.initialize)
        .then(aws.s3.initialize)
        .then(aws.s3.list_buckets)
        .then(_self => console.log("+", "ok", _self.buckets))
        .catch(error => console.log("#", _.error.message(error)))
}

// upload JSON
if (action("upload-json")) {
    _.promise.make({
        awsd: awsd,

        bucket: "consensas-test1",
        key: "name.json",
        json: {
            "hello": "world",
        },
    })
        .then(aws.initialize)
        .then(aws.s3.initialize)
        .then(aws.s3.upload_json)
        .then(_self => console.log("+", "ok", _self.aws_result))
        .catch(error => console.log("#", _.error.message(error)))
}

// upload document
if (action("upload-document")) {
    _.promise.make({
        awsd: awsd,

        bucket: "consensas-test1",
        key: "test.txt",
        document: "The quick brown fox jumped over the lazy dog",
    })
        .then(aws.initialize)
        .then(aws.s3.initialize)
        .then(aws.s3.upload_document)
        .then(_self => console.log("+", "ok", _self.aws_result))
        .catch(error => console.log("#", _.error.message(error)))
}

// delete object
if (action("delete-object")) {
    _.promise.make({
        awsd: awsd,

        bucket: "consensas-test1",
        key: "test.txt",
    })
        .then(aws.initialize)
        .then(aws.s3.initialize)
        .then(aws.s3.delete_object)
        .then(_self => console.log("+", "ok", _self.aws_result))
        .catch(error => console.log("#", _.error.message(error)))
}

// list files
if (action("list-objects")) {
    _.promise.make({
        awsd: awsd,
        bucket: "consensas-test1",
        key: "eLyccgRz",
    })
        .then(aws.initialize)
        .then(aws.s3.initialize)
        .then(aws.s3.list_objects)
        .then(_self => console.log("+", "ok", _self.paths))
        .catch(error => console.log("#", _.error.message(error)))
}

// list files
if (action("list-objects-recursive")) {
    _.promise.make({
        awsd: awsd,
        bucket: "consensas-test1",
        key: "eLyccgRz",
    })
        .then(aws.initialize)
        .then(aws.s3.initialize)
        .then(aws.s3.list_objects.recursive)
        .then(_self => console.log("+", "ok", _self.paths))
        .catch(error => console.log("#", _.error.message(error)))
}

// head files
if (action("head-object")) {
    _.promise.make({
        awsd: awsd,
        bucket: "consensas-test1",
        key: "name.jsonx",
    })
        .then(aws.initialize)
        .then(aws.s3.initialize)
        .then(aws.s3.head_object)
        .then(_self => console.log("+", "ok", _self.files))
        .catch(error => console.log("#", _.error.message(error)))
}


// object exists
if (action("object-exists")) {
    _.promise.make({
        awsd: awsd,
        bucket: "consensas-test1",
        key: "name.json",
    })
        .then(aws.initialize)
        .then(aws.s3.initialize)
        .then(aws.s3.object_exists)
        .then(_self => console.log("+", "ok", _self.exists))
        .catch(error => console.log("#", _.error.message(error)))
}


// object exists using path
if (action("object-exists-with-path")) {
    _.promise.make({
        awsd: awsd,
        path: "s3://consensas-test1/name.json",
    })
        .then(aws.initialize)
        .then(aws.s3.initialize)
        .then(aws.s3.parse_path)
        .then(aws.s3.exists)
        .then(_self => console.log("+", "ok", _self.exists))
        .catch(error => console.log("#", _.error.message(error)))
}

