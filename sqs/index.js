/*
 *  sqs/index.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-01-29
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict";

module.exports = Object.assign(
    {},
    require("./change_message_visibility"),
    require("./delete_message"),
    require("./delete_messages"),
    require("./get_queue_url"),
    require("./initialize"),
    require("./list_queues"),
    require("./list_dlq_sources"),
    require("./process_json"),
    require("./receive_json"),
    require("./receive_jsons"),
    require("./receive_message"),
    require("./receive_messages"),
    require("./requeue_message"),
    require("./requeue_messages"),
    require("./send_json"),
    {}
);
