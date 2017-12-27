/**
 *  s3/list_objects.js
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

const split = s => s.split("/").filter(s => s.length)

/**
 *  Requires: self.bucket, self.key
 *  Produces: self.paths
 */
const list_objects = recursive => _.promise.make((self, done) => {
    const method = "s3.list_objects";

    assert.ok(self.s3, `${method}: self.s3 is required`);
    assert.ok(_.is.String(self.bucket), `${method}: self.bucket must be a String`);
    assert.ok(_.is.String(self.key) || !self.key, `${method}: self.key must be a String or Null`);

    let prefix = "";
    if (self.key) {
        prefix = self.key;
        if (prefix.match(/[^\/]$/)) {
            prefix += "/";
        }
    }

    const level = split(prefix).length + 1;
    let keys = []
    let token = null;

    const _fetch = () => {
        self.s3.listObjectsV2({
            Bucket: self.bucket,
            Prefix: prefix,
            ContinuationToken: token,
        }, (error, data) => {
            if (error) {
                return done(error);
            }

            keys = keys.concat(
                data.Contents.map(cd => cd.Key)
                    .filter(name => split(name).length >= level)
                    .map(name => recursive ? name : split(name).slice(0, level).join("/"))
            )

            if (data.IsTruncated) {
                assert.ok(data.NextContinuationToken, `${method}: expected a ContinuationToken????`)
                token = data.NextContinuationToken;
                process.nextTick(_fetch)

                return;
            }

            self.paths = _.uniq(keys.sort())
            self.keys = self.paths;

            done(null, self);
        });
    }

    _fetch()
})

/**
 *  API
 */
exports.list_objects = list_objects(false);
exports.list_objects.recursive = list_objects(true);
