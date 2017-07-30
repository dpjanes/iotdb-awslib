/**
 *  s3/get_json.js
 *
 *  David Janes
 *  IOTDB
 *  2017-01-19
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const AWS = require("aws-sdk");
const Q = require("bluebird-q");

const aws = {
    s3: {
        get_object: require("./get_object").get_object,
    },
}

/**
 *  Accepts: 
 *  Produces:
 */
const get_json = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "s3.get_json";

    Q(self)
        .then(aws.s3.get_object)
        .then(sd => {
            self.aws_result = sd.aws_result;

            if (_.is.Buffer(sd.document)) {
                self.json = JSON.parse(sd.document.toString("utf-8"))
            } else {
                self.json = JSON.parse(sd.document);
            }

            done(null, self)
        })
        .catch(done)
}

/**
 *  API
 */
exports.get_json = Q.denodeify(get_json);
