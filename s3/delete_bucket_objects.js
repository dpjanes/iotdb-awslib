/**
 *  s3/delete_bucket_objects.js
 *
 *  David Janes
 *  IOTDB
 *  2017-02-22
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const AWS = require("aws-sdk");
const Q = require("bluebird-q");

const logger = require("../logger")(__filename);

/**
 *  Accepts: 
 *  Produces:
 *
 *  Delete all the objects within a Bucket under self.key
 *  Obviously very dangerous.
 */
const delete_bucket_objects = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "s3.delete_bucket_objects";

    const aws = {
        s3: {
            list_objects: require("./list_objects").list_objects,
            delete_object: require("./delete_object").delete_object,
        },
    }

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

    Q(self)
        .then(sd => _.d.add(sd, "recursive", true))
        .then(aws.s3.list_objects)
        .then(_sd => {
            counter.increment();

            _sd.keys.forEach(key => {
                const sd = _.d.clone.shallow(_sd);
                sd.key = key;

                counter.increment();

                Q(sd)
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
}

/**
 *  API
 */
exports.delete_bucket_objects = Q.denodeify(delete_bucket_objects);
