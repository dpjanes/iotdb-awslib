/**
 *  helpers/normalize_path.js
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

const normalize_path = (path) => path.split("/").filter(p => !_.is.Empty(p)).join("/");

/**
 *  API
 */
module.exports = normalize_path;
