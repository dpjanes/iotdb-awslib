/*
 *  dynamodb/index.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-02-09
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict";

module.exports = Object.assign(
    {},
    require("./initialize"),
    require("./all"),
    require("./create_table"),
    require("./delete_table"),
    require("./wait_table_exists"),
    require("./put"),
    require("./get"),
    require("./query_simple"),
    require("./scan_simple"),
    require("./delete"),
    {}
);
