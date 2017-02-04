/*
 *  lambda/index.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-02-04
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict";

module.exports = Object.assign(
    {},
    require("./initialize"),
    require("./invoke"),
    require("./async_json"),
    {}
);
