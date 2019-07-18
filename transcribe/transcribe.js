/**
 *  transcribe/transcribe.js
 *
 *  David Janes
 *  IOTDB
 *  2019-07-19
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict"

const _ = require("iotdb-helpers")

const AWS = require("aws-sdk")

/**
 */
const transcribe = _.promise((self, done) => {
    _.promise(self)
        .validate(transcribe)
        .end(done, self)
})

transcribe.method = "transcribe.transcribe"
transcribe.requires = {
    AWS$transcribe: _.is.Object,
}
transcribe.accepts = {
}
transcribe.produces = {
}

/**
 *  API
 */
exports.transcribe = transcribe
