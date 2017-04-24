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
    require("./change_message_visibility"),
    require("./delete_message"),
    require("./get_queue_url"),
    require("./initialize"),
    require("./list_queues"),
    require("./process_json"),
    require("./receive_json"),
    require("./receive_message"),
    require("./receive_messages"),
    require("./requeue_message"),
    require("./send_json"),
    {}
);
