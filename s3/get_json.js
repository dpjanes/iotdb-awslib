/**
 *  s3/get_json.js
 *
 *  David Janes
 *  IOTDB
 *  2017-01-19
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

/**
 */
const get_json = _.promise((self, done) => {
    const aws = require("..")

    _.promise.make(self)
        .validate(get_json)

        .then(aws.s3.get_object)
        // .then(document.to.json)
        .make(sd => {
            if (_.is.Buffer(sd.document)) {
                sd.json = JSON.parse(sd.document.toString("utf-8"))
            } else {
                sd.json = JSON.parse(sd.document);
            }
        })
        
        .end(done, self, get_json)
})

get_json.method = "s3.get_json"
get_json.description = ``
get_json.requires = {
    s3: _.is.Object,
    key: _.is.String,
    bucket: _.is.String,
}
get_json.produces = {
    json: _.is.JSON,
    aws_result: _.is.Object,
}

/**
 *  API
 */
exports.get_json = _.promise.denodeify(get_json);
