/**
 *  transcribe/initialize.js
 *
 *  David Janes
 *  IOTDB
 *  2019-07-19
 *
 *  Copyright (2013-2019) David Janes
 */

"use strict"

const _ = require("iotdb-helpers")

const AWS = require("aws-sdk")

/**
 */
const initialize = _.promise(self => {
    _.promise.validate(self, initialize)

    self.transcribe = new AWS.Transcribe({
        apiVersion: "2017-10-26",
    });
})

initialize.method = "transcribe.initialize"
initialize.requires = {
    AWS: _.is.Object,
}
initialize.accepts = {
}
initialize.produces = {
    AWS$transcribe: _.is.Object,
}

/**
 *  API
 */
exports.initialize = initialize
