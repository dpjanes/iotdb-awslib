#!/usr/bin/env node
/**
 *  s3-rm.js
 *
 *  David Janes
 *  IOTDB
 *  2017-07-05
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");
const path = require("path");
const fs = require("fs");

const AWS = require("aws-sdk");
const Q = require("bluebird-q");
const minimist = require('minimist');

const aws = require("../index");
const awsd = {
    // profile: "consensas",
}

const ad = minimist(process.argv.slice(2), {
    boolean: [ "recursive", ],
});

ad._.forEach(s3_path => {
    Q({
        awsd: awsd,
        path: s3_path,
    })
        .then(aws.initialize)
        .then(aws.s3.initialize)
        .then(aws.s3.parse_path)
        .then(aws.s3.delete_object)
        .then(_sd => {
            console.log("+", "removed:", s3_path)
        })
        .catch(error => {
            console.log("#", _.error.message(error))
        })
    
})
