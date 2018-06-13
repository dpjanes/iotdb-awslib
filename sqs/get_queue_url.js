/**
 *  sqs/get_queue_url.js
 *
 *  David Janes
 *  IOTDB
 *  2017-01-30
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const AWS = require("aws-sdk");

/**
 *  Accepts: 
 *  Produces:
 */
const get_queue_url = _.promise.make((self, done) => {
    const method = "sqs.get_queue_url";

    assert.ok(self.sqs, `${method}: self.sqs is required`);
    assert.ok(_.is.String(self.queue_name), `${method}: self.queue_name must be a String`);

    self.sqs.getQueueUrl({
        QueueName: self.queue_name,
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        self.queue_url = data.QueueUrl;

        return done(null, self);
    });
})

/**
 *  API
 */
exports.get_queue_url = get_queue_url
