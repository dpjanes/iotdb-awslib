/*
 *  logger.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-06-04
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const path = require("path");

const _root = path.dirname(path.dirname(__filename));

const logger = (source) => _.logger.make({
    name: "iotdb-awslib",
    source: source.substring(_root.length + 1).replace(/[.]js$/, ""),
})

/**
 *  API
 */
module.exports = logger;
