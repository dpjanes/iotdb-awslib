/**
 *  s3/path.build.all.js
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
const path = {}

/**
 */
path.build = _.promise.make(self => {
    _.promise.validate(self, path.build)

    self.path = key.startsWith("s3://") ? key : `s3://${self.bucket}/${key}`
})

path.build.method = "s3.path.build"
path.build.requires = {
    aws$s3: _.is.Object,
    bucket: _.is.String,
    key: _.is.String,
}
path.build.produces = {
    path: _.is.String,
}

/**
 */
path.build.all = _.promise.make(self => {
    _.promise.validate(self, path.build.all)

    self.paths = self.keys.map(key => key.startsWith("s3://") ? key : `s3://${self.bucket}/${key}`)
})

path.build.all.method = "s3.path.build.all"
path.build.all.requires = {
    aws$s3: _.is.Object,
    bucket: _.is.String,
}
path.build.all.produces = {
    paths: _.is.Array.of.String,
}

/**
 *  API
 */
exports.path = path
