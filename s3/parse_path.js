/**
 *  s3/parse_path.js
 *
 *  David Janes
 *  IOTDB
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

const assert = require("assert")
const url = require("url")

/**
 *  Accepts: 
 *  Produces:
 */
const parse_path = _.promise(self => {
    _.promise.validate(self, parse_path)

    const urlp = url.parse(self.path)
    switch (urlp.protocol) {
    case "s3:":
        assert.ok(urlp.hostname.indexOf('.') === -1, `${parse_path.method}: self.path: AWS regions not supported yet`)

        self.key = (urlp.pathname || "").replace(/^\//, '')
        self.bucket = urlp.hostname
        break

    case "https:":
        const match = urlp.hostname.match(/^([^.]*)[.]s3[.]amazonaws[.]com$/)
        if (!match) {
            assert.ok(false, `${parse_path.method}: don't recognize ${urlp.protocol}//${urlp.hostname}`)
        }

        self.key = (urlp.pathname || "").replace(/^\//, '')
        self.bucket = match[1]
        break

    default:
        assert.ok(false, `${parse_path.method}: bad protocol=${urlp.protocol}`)
    }

})

parse_path.method = "s3.parse_path"
parse_path.requires = {
    path: _.is.String,
}
parse_path.accepts = {
}
parse_path.produces = {
    key: _.is.String,
    bucket: _.is.String,
}

/**
 *  API
 */
exports.parse_path = parse_path
