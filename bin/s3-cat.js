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
const fs = require("iotdb-fs")

const assert = require("assert")
const path = require("path")

const AWS = require("aws-sdk")
const minimist = require("minimist")

const aws = require("../index")
const aws$cfg = {
}

const ad = minimist(process.argv.slice(2), {
    boolean: [ "download", "json", "help"],
    string: [ "profile", ],
});

const help = message => {
    const name = "template"

    if (message) {
        console.log(`${name}: ${message}`)
        console.log()
    }

    console.log(`usage: ${name} [options] <s3-url>...`)
    console.log("")
    console.log("Options:")
    console.log("--json          format JSON nicely")
    console.log("--download      download as file")
    console.log("")
    console.log("S3 URLs look like:")
    console.log("")
    console.log("  https://test-large.s3.amazonaws.com/Attachment-1.jpg")
    console.log("  s3://test-large/Attachment-1.jpg")

    process.exit(message ? 1 : 0)
}

if (ad.help) {
    help()
}
if (!ad._.length) {
    help("add at least one s3 url")
}

if (ad.profile) {
    aws$cfg.profile = ad.profile
}

/**
 */
const _download = _.promise((self, done) => {
    _.promise(self)
        .validate(_download)

        .add("path", path.basename(self.path))
        .then(fs.write)

        .end(done, self)
})

_download.method = "_download"
_download.requires = {
    document: [ _.is.String, _.is.Buffer ],
}

/**
 */
const _json = _.promise((self, done) => {
    _.promise(self)
        .validate(_json)

        .make(sd => {
            process.stdout.write(JSON.stringify(JSON.parse(sd.document), null, 2))
            process.stdout.write("\n")
        })

        .end(done, self)
})

_json.method = "_json"
_json.requires = {
    document: [ _.is.String, _.is.Buffer ],
}

/**
 */
const _stdout = _.promise((self, done) => {
    _.promise(self)
        .validate(_stdout)

        .then(fs.write.stdout)

        .end(done, self)
})

_stdout.method = "_stdout"
_stdout.requires = {
    document: [ _.is.String, _.is.Buffer ],
}

/**
 */
const _get = _.promise((self, done) => {
    _.promise(self)
        .validate(_get)

        .then(aws.s3.parse_path)
        .then(aws.s3.get_object)
        .conditional(ad.download, _download)
        .conditional(ad.json, _json)
        .conditional(!ad.download && !ad.json, _stdout)

        .end(done, self)
})

_get.method = "_get"
_get.requires = {
    path: _.is.AbsoluteURL,
}

/**
 */
_.promise({
    aws$cfg: aws$cfg,
    paths: ad._,
})
    .then(aws.initialize)
    .then(aws.s3.initialize)
    .each({
        method: _get,
        inputs: "paths:path",
    })

    .catch(error => {
        console.log("#", _.error.message(error))
    })
