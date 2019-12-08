/**
 *  s3/object_exists.js
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

/**
 *  Accepts: 
 *  Produces:
 */
const object_exists = _.promise.make((self, done) => {
    const method = "s3.object_exists";

    assert.ok(self.s3, `${method}: self.s3 is required`);
    assert.ok(_.is.String(self.bucket), `${method}: self.bucket must be a String`);
    assert.ok(_.is.String(self.key), `${method}: self.key must be a String`);

    self.s3.headObject({
        Bucket: self.bucket,
        Key: self.key,
    }, (error, data) => {
        if (!error) {
            self.exists = true;
            return done(null, self);
        }

        if (error.statusCode === 404) {
            self.exists = false;
            return done(null, self);
        }

        return done(error);
    });
})

/**
 *  API
 */
exports.object_exists = object_exists
