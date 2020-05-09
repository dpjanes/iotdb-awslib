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

const aws = require("../index");
const aws$cfg = {
    profile: "consensas",
    region: "us-east-1",
}

const minimist = require('minimist');
const ad = minimist(process.argv.slice(2), {
    binary: [ "verbose" ],
    string: [
        "language",
        "c",
        "translate",
    ],
});

const action = (name) => ad._.indexOf(name) > -1;

if (ad.profile) {
    aws$cfg.profile = ad.profile
}
if (ad.region) {
    aws$cfg.region = ad.region
}

const help = message => {
    const name = "translate-po"

    if (message) {
        console.log(`${name}: ${message}`)
        console.log()
        process.exit(message ? 1 : 0)
    }

    console.log(`\
usage: ${name} [options]  --c <c>.po --translate <file>.po --language <language>

Translate a file using AWS. 
Only messages not only translated will be

required:
--c <c>.po              english text
--translate <file>.po   file to translate
--language <language>   language to translate to
`)
}

if (!ad.c) {
    help("--c required")
}
if (!ad.translate) {
    help("--translate required")
}
if (!ad.language) {
    help("--language required")
}

/**
 */
const _po = _.promise((self, done) => {

    assert.ok(self.path)

    console.log("HERE:XXX", self.language)

   _.promise(self)
        .then(fs.read.utf8)
        .then(_.promise.add("language", sd => sd.language || sd.document_name.replace(/[.]po$/, "")))
        .then(_.promise(sd => {
            sd.translations = {}
            const tpo = gettextParser.po.parse(sd.document)

            _.mapObject(tpo.translations[''], (vd, key) => {
                sd.translations[key] = _.d.first(vd, "msgstr","");
            })

            console.log(tpo.translations[''])
            process.exit()

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
        .then(_.promise(sd => {
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

/**
 */
const _output = _.promise(self => {
    _.promise.validate(self, _output)

    const _out = (...str) => console.log(...str)

    _.mapObject(self.tpo.translations, (trdd, msgcstr) => {
        let first = true

        _.mapObject(trdd, (trd, msgid) => {
            const comments = _.d.first(trd, "comments/translator")
            if (comments) {
                _out()
                comments.split("\n").forEach(line => {
                    _out(`#   ${line}`)
                })
            }

            _out()
            if (first && msgcstr.length) {
                first = true
                _out(`msgcstr "${msgcstr}"`)
            }

            if (trd.msgid) {
                _out(`msgid "${trd.msgid}"`)
            }

            if (trd.msgstr) {
                if (trd.msgstr.length > 1) {
                    _out(`msgstr ""`)
                    trd.msgstr.forEach(s => _out(`"${s}"`))
                    
                } else {
                    _out(`msgstr "${trd.msgstr[0]}"`)
                }
            }
            // console.log(JSON.stringify(trd, null, 2))
        })
    })
})

_output.method = "_output"
_output.description = ``
_output.requires = {
    tpo: _.is.Dictionary,
}
_output.accepts = {
}
_output.produces = {
}

/**
 */
const _load = _.promise((self, done) => {
    _.promise(self)
        .validate(_load)

        .then(fs.read.utf8)
        .make(sd => {
            sd.tpo = gettextParser.po.parse(sd.document)
        })

        .end(done, self, _load)
})

_load.method = "_load"
_load.description = ``
_load.requires = {
    path: _.is.String,
}
_load.accepts = {
}
_load.produces = {
    tpo: _.is.Dictionary,
}
_load.params = {
    path: _.p.normal,
}
_load.p = _.p(_load)


/**
 */
_.promise({
    aws$cfg: aws$cfg,
    paths: ad._,
    language: ad.language,
})
    .then(aws.initialize)
    .then(aws.translate.initialize)

    .then(_load.p(ad.c))
    .make(sd => {
        sd.originald = {}

        _.mapObject(sd.tpo.translations, (trdd, msgcstr) => {
            let first = true

            _.mapObject(trdd, (trd, msgid) => {
                if (trd.msgstr) {
                    sd.originald[msgid] = trd.msgstr
                }
            })
        })
    })
    // .then(_output)

    .then(_load.p(ad.translate))
    .make(sd => {
        sd.nds = []

        _.mapObject(sd.tpo.translations, (trdd, msgcstr) => {
            let first = true

            _.mapObject(trdd, (trd, msgid) => {
                if (!trd.msgstr && sd.originald[msgid]) {
                    sd.nds.push({
                        msgid: msgid,
                        msgstr: sd.originald[msgid],
                    })
                }
            })
        })

        console.log("NEED", sd.nds)
    })
    // .then(_output)

    .make(sd => {
        // console.log(sd.originald)
        
    })

    .catch(error => {
        console.log("#", _.error.message(error))
        delete error.self
        console.log(error)
    })
