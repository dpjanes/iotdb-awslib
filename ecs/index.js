/*
 *  ses/index.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-12-04
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict";

module.exports = Object.assign(
    {},
    require("./initialize"),
    require("./list_clusters"),
    require("./list_tasks"),
    require("./list_task_definitions"),
    require("./run_task"),
    require("./stop_task"),
    {}
);
