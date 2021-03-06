/*
 *  comprehend/index.js
 *
 *  David Janes
 *  IOTDB
 *  2018-04-18
 *
 *  Copyright (2013-2021) David Janes
 */

"use strict";

module.exports = Object.assign(
    {},
    require("./entities"),
    require("./initialize"),
    require("./sentiment"),
    require("./syntax"),
    {}
);
