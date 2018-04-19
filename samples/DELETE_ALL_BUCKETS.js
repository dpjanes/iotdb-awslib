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

if (1) {
    _.promise.make({
        awsd: awsd,
    })
        .then(aws.initialize)
        .then(aws.s3.initialize)
        .then(aws.s3.list_buckets)
        .then(_self => {
            _self.buckets
                .filter(bucket => bucket.startsWith("ledger-"))
                .forEach(bucket => {
                    console.log("+", "delete bucket and everything in it", bucket);

                    _.promise.make(_self)
                        .then(sd => _.d.add(sd, "bucket", bucket))
                        .then(sd => _.d.add(sd, "key", ""))
                        .then(aws.s3.delete_bucket_objects)
                        .then(aws.s3.delete_bucket)
                        .catch(error => console.log("#", _.error.message(error)))
                })
        })
        .catch(error => console.log("#", _.error.message(error)))
}
