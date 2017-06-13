/**
 *  s3-cat.js
 *
 *  David Janes
 *  IOTDB
 *  2017-06-13
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
    binary: [ "download", "json", ],
});

const action = (name) => ad._.indexOf(name) > -1;

ad._.forEach(s3_path => {
    Q({
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
            } else {
                console.log("+", _sd.document.length)
            }
        })
        .catch(error => {
            console.log("#", _.error.message(error))
        })
    
})
