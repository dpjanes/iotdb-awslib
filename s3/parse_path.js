/**
 *  s3/parse_path.js
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
const url = require("url");

const AWS = require("aws-sdk");

/**
 *  Accepts: 
 *  Produces:
 */
const parse_path = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "s3.parse_path";

    assert.ok(_.is.String(self.path), `${method}: self.path must be a String`);

    const urlp = url.parse(self.path)
    assert.ok(urlp.protocol === "s3:", `${method}: self.path: protocol must be "s3:"`);
    assert.ok(urlp.hostname.indexOf('.') === -1, `${method}: self.path: AWS regions not supported yet`);

    self.key = urlp.pathname.replace(/^\//, '')
    self.bucket = urlp.hostname;
    
    done(null, self);
}

/**
 *  API
 */
exports.parse_path = _.promise.denodeify(parse_path);
