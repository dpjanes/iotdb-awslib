#!/usr/bin/env node
/**
 *  s3-upload.js
 *
 *  David Janes
 *  IOTDB
 *  2017-06-13
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict"

const _ = require("iotdb-helpers")
const fs = require("iotdb-fs")

const assert = require("assert")
const path = require("path")

const AWS = require("aws-sdk")
const minimist = require("minimist")

const aws = require("../index")
const awsd = {
}

const ad = minimist(process.argv.slice(2), {
    boolean: [ "download", "json", "help"],
    string: [ "profile", ],
});

const help = message => {
    const name = "s3-upload"

    if (message) {
        console.log(`${name}: ${message}`)
        console.log()
    }

    console.log(`usage: ${name} <local-file>... <s3-url>`)
    console.log("")
    // console.log("Options:")
    // console.log("")
    console.log("S3 URLs look like:")
    console.log("")
    console.log("  https://test-large.s3.amazonaws.com/Attachment-1.jpg")
    console.log("  s3://test-large/Attachment-1.jpg")

    process.exit(message ? 1 : 0)
}

if (ad.help) {
    help()
}
if (ad._.length < 2) {
    help("at last one path, and a S3 URL is required")
}

if (ad.profile) {
    awsd.profile = ad.profile
}

/**
 */
const _upload = _.promise((self, done) => {
    _.promise(self)
        .validate(_upload)

        .add("path", self.upload.from)
        .then(fs.read)

        .add("path", self.upload.to)
        .then(aws.s3.parse_path)

        .then(aws.s3.upload_document)
        .make(sd => {
            console.log("-", sd.upload.from, ">", sd.upload.to)
        })

        .end(done, self)
})

_upload.method = "_upload"
_upload.requires = {
    upload: {
        from: _.is.String,
        to: _.is.AbsoluteURL,
    },
}

const uploads = []

if (ad._.length === 2) {
    if (ad._[1].endsWith("/")) {
        uploads.push({
            from: ad._[0],
            to: `${ad._[1]}${path.basename(ad._[0])}`
        })
    } else {
        uploads.push({
            from: ad._[0],
            to: ad._[1],
        })
    }
} else {
    const last = ad._.pop()
    if (!last.endsWith("/")) {
        help("when copying multiple files, the S3 URL must end in a URL")
    }

    ad._.forEach(p => {
        uploads.push({
            from: p,
            to: `${last}${path.basename(p)}`
        })
    })
}

_.promise({
    awsd: awsd,
    uploads: uploads,
})
    .then(aws.initialize)
    .then(aws.s3.initialize)
    .each({
        method: _upload,
        inputs: "uploads:upload",
    })

    .catch(error => {
        console.log("#", _.error.message(error))
    })
