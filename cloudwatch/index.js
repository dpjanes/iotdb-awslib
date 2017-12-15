/*
 *  cloudwatch/index.js
 *
 *  David Janes
 *  IOTDB
 *  2017-12-13
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict";

module.exports = Object.assign(
    {},
    require("./create_log_group"),
    require("./create_log_stream"),
    require("./describe_log_groups"),
    require("./describe_log_streams"),
    require("./get_log_events"),
    require("./get_jsons"),
    require("./initialize"),
    require("./log_jsons"),
    {}
);
