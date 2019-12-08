/**
 *  s3/initialize.js
 *
 *  David Janes
 *  IOTDB
 *  2017-01-18
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const AWS = require("aws-sdk");

/**
 */
const initialize = _.promise(self => {
    _.promise.validate(self, initialize)

    self.s3 = new AWS.S3({
        apiVersion: '2006-03-01',
    });
})

initialize.method = "s3.initialize"
initialize.description = ``
initialize.requires = {
    AWS: _.is.Dictionary,
}
initialize.produces = {
    s3: _.is.Object,
}

/**
 *  API
 */
exports.initialize = _.promise.denodeify(initialize);
