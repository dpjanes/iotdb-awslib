/**
 *  s3/object.list.js
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

const split = s => s.split("/").filter(s => s.length)

/**
 */
const _object_list = recursive => _.promise.make((self, done) => {
    _.promise.validate(self, object.list)

    let prefix = ""
    if (self.key) {
        prefix = self.key
        if (prefix.match(/[^\/]$/)) {
            prefix += "/"
        }
    }

    const level = split(prefix).length + 1
    let keys = []
    let token = null

    const _fetch = () => {
        self.aws$s3.listObjectsV2({
            Bucket: self.bucket,
            Prefix: prefix,
            ContinuationToken: token,
        }, (error, data) => {
            if (error) {
                return done(error)
            }

            keys = keys.concat(
                data.Contents.map(cd => cd.Key)
                    .filter(name => split(name).length >= level)
                    .map(name => recursive ? name : split(name).slice(0, level).join("/"))
            )

            if (data.IsTruncated) {
                assert.ok(data.NextContinuationToken, `${method}: expected a ContinuationToken????`)
                token = data.NextContinuationToken
                process.nextTick(_fetch)

                return
            }

            self.paths = _.uniq(keys.sort())
            self.keys = self.paths

            done(null, self)
        })
    }

    _fetch()
})

const object = {}
object.list = _object_list(false)
object.list.method = "s3.object.list"
object.list.requires = {
    aws$s3: _.is.Object,
    bucket: _.is.String,
}
object.list.accepts = {
    key: _.is.String,
}
object.list.produces = {
    aws$result: _.is.Object,
    paths: _.is.Array.of.String,
    keys: _.is.Array.of.String,
}

object.list.recursive = _object_list(true)
object.list.recursive.method = "s3.object.list.recursive"
object.list.recursive.requires = object.list.requires
object.list.recursive.accepts = object.list.accepts
object.list.recursive.produces = object.list.produces

/**
 *  API
 */
exports.object = exports.object
