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
const list_buckets = _.promise((self, done) => {
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
    
})

list_buckets.method = "s3.list_buckets"
list_buckets.description = ``
list_buckets.requires = {
    s3: _.is.Object,
}
list_buckets.accepts = {
}
list_buckets.produces = {
}
list_buckets.params = {
}
list_buckets.p = _.p(list_buckets)

/**
 *  API
 */
exports.list_buckets = _.promise.denodeify(list_buckets);
