/**
 *  s3/join_paths.js
 *
 *  David Janes
 *  IOTDB
 *  2017-12-27
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");
const url = require("url");

/**
 *  Requires: self.paths, self.bucket
 *  Produces: self.paths
 */
const join_paths = _.promise.make((self, done) => {
    const method = "s3.join_paths";

    assert.ok(_.is.Array.of.String(self.paths), `${method}: self.paths must be Array of String`)
    assert.ok(_.is.String(self.bucket), `${method}: self.bucket must be String`)

    sd.paths = sd.paths.map(name => name.startsWith("s3://") ? name : `s3://${_self.bucket}/${name}`)

    done(null, self);
})

/**
 *  API
 */
exports.join_paths = join_paths;
