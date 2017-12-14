
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
    require("./describe_stream"),
    require("./get_jsons"),
    require("./get_records"),
    require("./get_shard_iterator"),
    require("./initialize"),
    require("./list_streams"),
    require("./send_json"),
    require("./wait_for"),
    {}
);
