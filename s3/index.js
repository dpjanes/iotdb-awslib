/*
 *  s3/index.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-01-18
 *
 *  Copyright (2013-2020) David P. Janes
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
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
