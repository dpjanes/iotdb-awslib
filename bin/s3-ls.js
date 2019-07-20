#!/usr/bin/env node
/**
 *  s3-ls.js
 *
 *  David Janes
 *  IOTDB
 *  2017-06-13
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict"

const _ = require("iotdb-helpers")

const assert = require("assert")
const path = require("path")
const fs = require("fs")

const AWS = require("aws-sdk")
const minimist = require('minimist')

const aws = require("../index")
const awsd = {
}

const ad = minimist(process.argv.slice(2), {
    binary: [ "download", "json", "recursive" ],
    string: [ "profile", ],
})

if (ad.profile) {
    awsd.profile = ad.profile
}

const action = (name) => ad._.indexOf(name) > -1;

ad._.forEach(s3_path => {
    _.promise.make({
        awsd: awsd,
        path: s3_path,
        recursive: ad.recursive,
    })
        .then(aws.initialize)
        .then(aws.s3.initialize)
        .then(aws.s3.parse_path)
        .then(aws.s3.list_objects)
        .then(_sd => {
            _sd.paths.forEach(s3_path2 => {
                console.log(`s3://${_sd.bucket}/${s3_path2}`)
            })
        })
        .catch(error => {
            console.log("#", _.error.message(error))

            delete error.self
            console.log(error)
        })
    
})
