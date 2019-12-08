/**
 *  s3/join_paths.js
 *
 *  David Janes
 *  IOTDB
 *  2017-12-27
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

/**
 */
const join_paths = _.promise.make(self => {
    _.promise.validate(self, join_paths)

    self.paths = self.paths.map(name => name.startsWith("s3://") ? name : `s3://${self.bucket}/${name}`)
})

join_paths.method = "s3.join_paths"
join_paths.requires = {
    aws$s3: _.is.Object,
    bucket: _.is.String,
}
join_paths.produces = {
    paths: _.is.Array.of.String,
}

/**
 *  API
 */
exports.join_paths = join_paths
