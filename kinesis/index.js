
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
    require("./get_shard_iterator"),
    require("./get_records"),
    require("./initialize"),
    require("./describe_stream"),
    require("./send_json"),
    require("./list_streams"),
    require("./wait_for"),
    {}
);
