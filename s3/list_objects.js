/**
 *  s3/list_objects.js
 *
 *  David Janes
 *  IOTDB
 *  2017-01-18
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const AWS = require("aws-sdk");
const Q = require("bluebird-q");

const split = s => s.split("/").filter(s => s.length)

/**
 *  Accepts: self.bucket, self.key, self.recursive (optional)
 *  Produces: self.paths
 */
const list_objects = (_self, done) => {
    const self = _.d.clone.shallow(_self);
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

    self.s3.listObjectsV2({
        Bucket: self.bucket,
        Prefix: prefix,
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        assert(!data.IsTruncated, "s3.list_objects: if you get this, complete implementation of this function!");

        const level = split(prefix).length + 1;

        // XXX - need to add bucket prefix?
        self.paths = _.uniq(data.Contents.map(cd => cd.Key)
            .filter(name => split(name).length >= level)
            .map(name => self.recursive ? name : split(name).slice(0, level).join("/"))
            .sort())

        self.keys = self.paths;

        done(null, self);
    });
}

/**
 *  API
 */
exports.list_objects = Q.denodeify(list_objects);
