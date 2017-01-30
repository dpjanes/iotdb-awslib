/*
 *  sqs/index.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-01-29
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict";

module.exports = Object.assign(
    {},
    require("./initialize"),
    require("./list_queues"),
    require("./get_queue_url"),
    require("./send_json"),
    require("./receive_messages"),
    require("./receive_message"),
    require("./receive_json"),
    require("./delete_message"),
    require("./process_json"),
    {}
);
