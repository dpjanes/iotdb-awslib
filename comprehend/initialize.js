/**
 *  comprehend/initialize.js
 *
 *  David Janes
 *  IOTDB
 *  2018-04-18
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict"

const _ = require("iotdb-helpers")

const AWS = require("aws-sdk")

/**
 */
const initialize = _.promise.make(self => {
    _.promise.validate(self, initialize)

    self.aws$comprehend = new AWS.Comprehend({
        apiVersion: "2017-11-27",
    });
})

initialize.method = "comprehend.initialize"
initialize.description = ``
initialize.requires = {
    AWS: _.is.Dictionary,
}
initialize.produces = {
    aws$comprehend: _.is.Object,
}

/**
 *  API
 */
exports.initialize = initialize
