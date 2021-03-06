/**
 *  s3/bucket.delete.objects.js
 *
 *  David Janes
 *  IOTDB
 *  2017-02-22
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

const logger = require("../logger")(__filename)

/**
 *  Accepts: 
 *  Produces:
 *
 *  Delete all the objects within a Bucket under self.key
 *  Obviously very dangerous.
 */
const bucket = {}
bucket.delete = {}
bucket.delete.objects = _.promise((self, done) => {
    const aws = require("..")

    _.promise.validate(self, bucket.delete.objects)

    logger.info({
        method: bucket.delete.objects.method,
        bucket: self.bucket,
        key: self.key,
    }, "delete bucket objects")

    _.promise(self)
        .then(aws.s3.object.list)
        .each({
            method: aws.s3.object.delete,
            inputs: "keys:key",
        })
        .end(done, self)
})

bucket.delete.objects.method = "s3.bucket.delete.objects"
bucket.delete.objects.description = ``
bucket.delete.objects.requires = {
    aws$s3: _.is.Object,
    bucket: _.is.String,
    key: _.is.String,
}
bucket.delete.objects.produces = {
}
bucket.delete.objects.params = {
    bucket: _.p.normal,
    key: "",
}
bucket.delete.objects.p = _.p(bucket.delete.objects)

/**
 *  API
 */
exports.bucket = bucket
