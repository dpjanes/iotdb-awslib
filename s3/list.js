/**
 *  s3/list.js
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
const Q = require("q");

const normalize_path = require("../helpers/normalize_path");
const split = s => s.split("/").filter(s => s.length)

/**
 *  Accepts: 
 *  Produces:
 */
const list = (_self, done) => {
   const self = _.d.clone.shallow(_self);

    assert.ok(self.s3, "s3.list: self.s3 is required");
    assert.ok(_.is.String(self.bucket), "s3.list: self.bucket must be a String");
    assert.ok(_.is.String(self.path) || !self.path, "s3.upload_document: self.path must be a String or Null");

    let prefix = "";
    if (self.path) {
        prefix = normalize_path(self.path)
        if (prefix.length) {
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

        assert(!data.IsTruncated, "s3.list: if you get this, complete implementation of this function!");

        const level = split(prefix).length + 1;

        self.paths = data.Contents.map(cd => cd.Key)
            .filter(name => split(name).length === level)
        self.files = self.paths
            .filter(name => !name.endsWith("/"))
        self.folders = self.paths
            .filter(name => name.endsWith("/"))
            .map(name => name.replace(/\/$/, ""))

        done(null, self);
    });
}

/**
 *  API
 */
exports.list = Q.denodeify(list);
