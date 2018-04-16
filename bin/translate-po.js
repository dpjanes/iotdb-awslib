#!/usr/bin/env node
/**
 *  translate-po.js
 *
 *  David Janes
 *  IOTDB
 *  2018-04-14
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");
const fs = require("iotdb-fs");

const assert = require("assert");
const path = require("path");

const gettextParser = require("gettext-parser");

const AWS = require("aws-sdk");
const minimist = require('minimist');

const aws = require("../index");
const awsd = {
    profile: "consensas",
    region: "us-east-1",
}

const ad = minimist(process.argv.slice(2), {
    binary: [ "verbose" ],
});

const action = (name) => ad._.indexOf(name) > -1;

if (ad.profile) {
    awsd.profile = ad.profile
}
if (ad.region) {
    awsd.region = ad.region
}

/**
 */
const _po = _.promise.make((self, done) => {

    assert.ok(self.path)

   _.promise.make(self)
        .then(fs.read.utf8)
        .then(_.promise.add("language", sd => sd.language || sd.document_name.replace(/[.]po$/, "")))
        .then(_.promise.make(sd => {
            sd.translations = {}
            const tpo = gettextParser.po.parse(sd.document)

            _.mapObject(tpo.translations[''], (vd, key) => {
                sd.translations[key] = _.d.first(vd, "msgstr","");
            })

            sd.translates = []

            _.mapObject(sd.translations, (value, key) => {
                if (_.is.Empty(value)) {
                    sd.translates.push(key)
                }
            })
        }))
        .then(_.promise.series({
            method: aws.translate.translate,
            inputs: "translates:document",
            outputs: "results",
            output_selector: sd => sd.document,
        }))
        .then(_.promise.make(sd => {
            sd.translates.forEach((key, index) => {
                sd.translations[key] = sd.results[index]
            })

            _.mapObject(sd.translations, (value, key) => {
                console.log(`\
msgid "${key}"
msgstr "${value}"
`)
            })
        }))
        .then(_.promise.done(done, self))
        .catch(done)

    
})

_.promise.make({
    awsd: awsd,
    paths: ad._,
    language: ad.language,
})
    .then(aws.initialize)
    .then(aws.translate.initialize)
    .then(_.promise.series({
        method: _po,
        inputs: "paths:path",
    }))
    .then(_.promise.make(sd => {
    }))
    .catch(error => {
        console.log("#", _.error.message(error))
        delete error.self
        console.log(error)
    })
