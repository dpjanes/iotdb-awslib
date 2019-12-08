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

    const counter = _.counter(error => {
        if (error) {
            done(error)
        } else {
            done(null, _self)
        }
    })
    counter.increment()

    _.promise.make(self)
        .then(sd => _.d.add(sd, "recursive", true))
        .then(aws.s3.object.list)
        .then(_sd => {
            counter.increment()

            _sd.keys.forEach(key => {
                const sd = _.d.clone.shallow(_sd)
                sd.key = key

                counter.increment()

                _.promise.make(sd)
                    .then(aws.s3.object.delete)
                    .then(() => {
                        logger.info({
                            method: bucket.delete.objects.method,
                            bucket: sd.bucket,
                            key: sd.key,
                        }, "deleted bucket object")

                        counter.decrement()
                        return null
                    })
                    .catch(error => {
                        logger.error({
                            method: bucket.delete.objects.method,
                            bucket: self.bucket,
                            key: sd.key,
                            error: _.error.message(error),
                        }, "unexpected error deleting bucket objects")

                        counter.decrement(); // ignoring error
                    })
            })

            counter.decrement()
            return null
        })
        .then(() => {
            counter.decrement()
            return null
        })
        .catch(error => counter.decrement(error))
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

/**
 *  API
 */
exports.bucket = bucket
