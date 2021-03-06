/**
 *  s3/path.parse.js
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
const path = {}
path.parse = _.promise(self => {
    _.promise.validate(self, path.parse)

    const urlp = url.parse(self.path)
    switch (urlp.protocol) {
    case "s3:":
        assert.ok(urlp.hostname.indexOf('.') === -1, `${path.parse.method}: self.path: AWS regions not supported yet`)

        self.key = (urlp.pathname || "").replace(/^\//, '')
        self.bucket = urlp.hostname
        break

    case "https:":
        const match = urlp.hostname.match(/^([^.]*)[.]s3[.]amazonaws[.]com$/)
        if (!match) {
            assert.ok(false, `${path.parse.method}: don't recognize ${urlp.protocol}//${urlp.hostname}`)
        }

        self.key = (urlp.pathname || "").replace(/^\//, '')
        self.bucket = match[1]
        break

    default:
        assert.ok(false, `${path.parse.method}: bad protocol=${urlp.protocol}`)
    }

})

path.parse.method = "s3.path.parse"
path.parse.requires = {
    path: _.is.String,
}
path.parse.accepts = {
}
path.parse.produces = {
    key: _.is.String,
    bucket: _.is.String,
}

/**
 *  API
 */
exports.path = path
