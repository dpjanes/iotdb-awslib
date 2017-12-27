/**
 *  s3/list_buckets.js
 *
 *  David Janes
 *  IOTDB
 *  2017-01-18
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const AWS = require("aws-sdk");

/**
 *  Accepts: 
 *  Produces:
 */
const list_buckets = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "s3.list_buckets";

    assert.ok(self.s3, `${method}: self.s3 is required`);

    self.s3.listBuckets({
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        self.buckets = data.Buckets.map(bd => bd.Name);
        self.aws_result = data;

        done(null, self);
    });
    
}

/**
 *  API
 */
exports.list_buckets = _.promise.denodeify(list_buckets);
