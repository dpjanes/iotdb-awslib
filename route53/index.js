/*
 *  route53/index.js
 *
 *  David Janes
 *  IOTDB
 *  2018-03-08
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict"

module.exports = Object.assign(
    {},
    require("./initialize"),
    require("./find_hosted_zone"),
    require("./list_hosted_zones"),
    {}
);
