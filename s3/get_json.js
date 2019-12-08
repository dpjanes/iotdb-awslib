/**
 *  s3/get_json.js
 *
 *  David Janes
 *  IOTDB
 *  2017-01-19
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

/**
 */
const get_json = _.promise((self, done) => {
    const aws = require("..")

    _.promise.make(self)
        .validate(get_json)

        .then(aws.s3.get_object)
        // .then(document.to.json)
        .make(sd => {
            if (_.is.Buffer(sd.document)) {
                sd.json = JSON.parse(sd.document.toString("utf-8"))
            } else {
                sd.json = JSON.parse(sd.document);
            }
        })
        
        .end(done, self, get_json)
})

get_json.method = "s3.get_json"
get_json.description = ``
get_json.requires = {
    s3: _.is.Object,
    key: _.is.String,
    bucket: _.is.String,
}
get_json.produces = {
    json: _.is.JSON,
    aws_result: _.is.Object,
}

/**
 *  API
 */
exports.get_json = _.promise.denodeify(get_json);
