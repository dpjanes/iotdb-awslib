/**
 *  s3/list_objects.js
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

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const split = s => s.split("/").filter(s => s.length)

/**
 *  Requires: self.bucket, self.key
 *  Produces: self.paths
 */
const list_objects = recursive => _.promise.make((self, done) => {
    const method = "s3.list_objects";

    assert.ok(self.s3, `${method}: self.s3 is required`);
    assert.ok(_.is.String(self.bucket), `${method}: self.bucket must be a String`);
    assert.ok(_.is.String(self.key) || !self.key, `${method}: self.key must be a String or Null`);

    let prefix = "";
    if (self.key) {
        prefix = self.key;
        if (prefix.match(/[^\/]$/)) {
            prefix += "/";
        }
    }

    const level = split(prefix).length + 1;
    let keys = []
    let token = null;

    const _fetch = () => {
        self.s3.listObjectsV2({
            Bucket: self.bucket,
            Prefix: prefix,
            ContinuationToken: token,
        }, (error, data) => {
            if (error) {
                return done(error);
            }

            keys = keys.concat(
                data.Contents.map(cd => cd.Key)
                    .filter(name => split(name).length >= level)
                    .map(name => recursive ? name : split(name).slice(0, level).join("/"))
            )

            if (data.IsTruncated) {
                assert.ok(data.NextContinuationToken, `${method}: expected a ContinuationToken????`)
                token = data.NextContinuationToken;
                process.nextTick(_fetch)

                return;
            }

            self.paths = _.uniq(keys.sort())
            self.keys = self.paths;

            done(null, self);
        });
    }

    _fetch()
})

/**
 *  API
 */
exports.list_objects = list_objects(false);
exports.list_objects.recursive = list_objects(true);
