/**
 *  s3/delete_bucket_objects.js
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

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const logger = require("../logger")(__filename);

/**
 *  Accepts: 
 *  Produces:
 *
 *  Delete all the objects within a Bucket under self.key
 *  Obviously very dangerous.
 */
const delete_bucket_objects = _.promise((self, done) => {
    const aws = require("..")

    assert.ok(self.s3, `${method}: self.s3 is required`);
    assert.ok(_.is.String(self.bucket), `${method}: self.bucket must be a String`);
    assert.ok(_.is.String(self.key), `${method}: self.key must be a String`);

    logger.info({
        method: method,
        bucket: self.bucket,
        key: self.key,
    }, "delete bucket objects");

    const counter = _.counter(error => {
        if (error) {
            done(error);
        } else {
            done(null, _self);
        }
    })
    counter.increment();

    _.promise.make(self)
        .then(sd => _.d.add(sd, "recursive", true))
        .then(aws.s3.list_objects)
        .then(_sd => {
            counter.increment();

            _sd.keys.forEach(key => {
                const sd = _.d.clone.shallow(_sd);
                sd.key = key;

                counter.increment();

                _.promise.make(sd)
                    .then(aws.s3.delete_object)
                    .then(() => {
                        logger.info({
                            method: method,
                            bucket: sd.bucket,
                            key: sd.key,
                        }, "deleted bucket object")

                        counter.decrement();
                        return null;
                    })
                    .catch(error => {
                        logger.error({
                            method: method,
                            bucket: self.bucket,
                            key: sd.key,
                            error: _.error.message(error),
                        }, "unexpected error deleting bucket objects")

                        counter.decrement(); // ignoring error
                    })
            })

            counter.decrement();
            return null;
        })
        .then(() => {
            counter.decrement()
            return null;
        })
        .catch(error => counter.decrement(error));
})

delete_bucket_objects.method = "s3.delete_bucket_objects"
delete_bucket_objects.description = ``
delete_bucket_objects.requires = {
    s3: _.is.Object,
}
delete_bucket_objects.accepts = {
}
delete_bucket_objects.produces = {
}
delete_bucket_objects.params = {
}
delete_bucket_objects.p = _.p(delete_bucket_objects)

/**
 *  API
 */
exports.delete_bucket_objects = delete_bucket_objects
