/**
 *  sqs/get_queue_attributes.js
 *
 *  David Janes
 *  IOTDB
 *  2018-10-16
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict"

const _ = require("iotdb-helpers")

const assert = require("assert")

/**
 *  Requires: self.sqs, self.queue_url
 *  Produces: self.json
 */
const get_queue_attributes = _.promise.make((self, done) => {
    const method = "sqs.get_queue_attributes";

    assert.ok(self.sqs, `${method}: self.sqs is required`);
    assert.ok(_.is.AbsoluteURL(self.queue_url), `${method}: self.queue_url must be a URL`);

    self.sqs.getQueueAttributes({
        QueueUrl: self.queue_url,
        AttributeNames: [ "All" ],
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        self.json = data.Attributes
        _.mapObject(self.json, (value, key) => {
            self.json[key] = _.coerce.to.Number(value, value)
        })

        done(null, self)
    })
})

/**
 *  API
 */
exports.get_queue_attributes = get_queue_attributes
