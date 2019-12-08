/**
 *  s3/bucket_exists.js
 *
 *  David Janes
 *  IOTDB
 *  2017-01-18
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict"

const _ = require("iotdb-helpers")

const assert = require("assert")

/**
 */
const bucket_exists = _.promise((self, done) => {
    _.promise.validate(self, bucket_exists)

    _.promise(self)
        .validate(bucket_exists)

        .make(sd => {
            sd.exists = true
            sd.param = {
                Bucket: self.bucket,
            }
        })
        .wrap(self.s3.getBucketLocation.bind(self.s3), "param", "data")
        .except(error => {
            if (error.statusCode === 404) {
                error.self.exists = false
                return error.self
            }

            throw error
        })

        .end(done, self, bucket_exists)

/*
    assert.ok(self.s3, `${bucket_exists.method}: self.s3 is required`);
    assert.ok(_.is.String(self.bucket), `${bucket_exists.method}: self.bucket must be a String`);

    self.s3.getBucketLocation({
        Bucket: self.bucket,
    }, (error, data) => {
        if (!error) {
            self.exists = true;
            return done(null, self);
        }

        if (error.statusCode === 404) {
            self.exists = false;
            return done(null, self);
        }

        return done(error);
    });
*/
})

bucket_exists.method = "s3.bucket_exists"
bucket_exists.description = ``
bucket_exists.requires = {
    s3: _.is.Object,
    bucket: _.is.String,
}
bucket_exists.produces = {
    exists: _.is.Boolean,
}
bucket_exists.params = {
    bucket: _.is.String,
}
bucket_exists.p = _.p(bucket_exists)

/**
 *  API
 */
exports.bucket_exists = _.promise.denodeify(bucket_exists);
