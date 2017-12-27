/*
 *  s3/index.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-01-18
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict";

module.exports = Object.assign(
    {},
    require("./bucket_exists"),
    require("./create_bucket"),
    require("./delete_bucket"),
    require("./delete_bucket_objects"),
    require("./delete_object"),
    require("./get_json"),
    require("./get_object"),
    require("./head_object"),
    require("./initialize"),
    require("./list_buckets"),
    require("./list_objects"),
    require("./object_exists"),
    require("./parse_path"),
    require("./join_paths"),
    require("./upload_document"),
    require("./upload_json"),
    {}
);
