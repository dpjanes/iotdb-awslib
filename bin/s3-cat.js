#!/usr/bin/env node
/**
 *  s3-cat.js
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
    boolean: [ "download", "json", ],
    string: [ "profile", ],
});

if (ad.profile) {
    awsd.profile = ad.profile
}

const action = (name) => ad._.indexOf(name) > -1;

ad._.forEach(s3_path => {
    _.promise.make({
        awsd: awsd,
        path: s3_path,
    })
        .then(aws.initialize)
        .then(aws.s3.initialize)
        .then(aws.s3.parse_path)
        .then(aws.s3.get_object)
        .then(_sd => {
            // console.log(_sd)
            if (ad.download) {
                const name = path.basename(s3_path)
                fs.writeFileSync(name, _sd.document)

                console.log("+", "downloaded:", name)
            } else if (ad.json) {
                process.stdout.write(JSON.stringify(JSON.parse(_sd.document), null, 2))
                process.stdout.write("\n")
            } else {
                process.stdout.write(_sd.document)
            }
        })
        .catch(error => {
            console.log("#", _.error.message(error))
        })
    
})
