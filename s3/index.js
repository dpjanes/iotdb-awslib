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

"use strict"

const _ = require("iotdb-helpers")

module.exports = _.d.compose.deep(
    {},
    require("./bucket.create"),
    require("./bucket.delete"),
    require("./bucket.exists"),
    require("./bucket.list"),
    require("./initialize"),
    require("./json.get"),
    require("./json.put"),
    require("./object.delete"),
    require("./object.exists"),
    require("./object.get"),
    require("./object.head"),
    require("./object.list"),
    require("./object.put"),
    require("./path.build"),
    require("./path.parse"),
    {}
)

module.exports.bucket.delete.objects = require("./bucket.delete.objects").bucket.delete.objects
