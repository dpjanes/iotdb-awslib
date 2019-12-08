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

const assert = require("assert")
const url = require("url")

/**
 *  Requires: self.paths, self.bucket
 *  Produces: self.paths
 */
const join_paths = _.promise.make((self, done) => {
    const method = "s3.join_paths"

    assert.ok(_.is.Array.of.String(self.paths), `${method}: self.paths must be Array of String`)
    assert.ok(_.is.String(self.bucket), `${method}: self.bucket must be String`)

    self.paths = self.paths.map(name => name.startsWith("s3://") ? name : `s3://${self.bucket}/${name}`)

    done(null, self)
})

/**
 *  API
 */
exports.join_paths = join_paths
