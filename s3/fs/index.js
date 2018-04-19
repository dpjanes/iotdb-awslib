/*
 *  s3/fs/index.js
 *
 *  David Janes
 *  IOTDB.org
 *  2018-04-19
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict";

module.exports = Object.assign(
    {},
    require("./list"),
    require("./remove"),
    require("./write"),
    {}
);

module.exports.join = require("iotdb-helpers").net.url.join;
