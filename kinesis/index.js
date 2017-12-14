/*
 *  kinesis/index.js
 *
 *  David Janes
 *  IOTDB
 *  2017-04-23
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict";

module.exports = Object.assign(
    {},
    require("./initialize"),
    require("./send_json"),
    require("./list_streams"),
    {}
);
