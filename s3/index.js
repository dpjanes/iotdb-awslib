/*
 *  s3/index.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-01-18
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict";

module.exports = Object.assign(
    {},
    require("./create_bucket"),
    require("./head_object"),
    require("./initialize"),
    require("./list_objects"),
    require("./list_buckets"),
    require("./exists"),
    require("./upload_document"),
    require("./upload_json"),
    {}
);
