/**
 *  sqs/requeue_message.js
 *
 *  David Janes
 *  IOTDB
 *  2017-04-24
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

/**
 *  Accepts: self.sqs, self.message, self.queue_url
 *  Produces:
 *
 *  Changes message visibility to 0, making it available to
 *  other queue proccessors
 */
const requeue_message = _.promise.make((self, done) => {
    const method = "sqs.requeue_message";

    assert.ok(self.sqs, `${method}: self.sqs is required`);
    assert.ok(_.is.String(self.queue_url), `${method}: self.queue_url must be a String`);

    if (!self.message) {
        return done(null, self);
    }

    self.sqs.changeMessageVisibility({
        QueueUrl: self.queue_url,
        ReceiptHandle: self.message.ReceiptHandle,
        VisibilityTimeout: 0,
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        return done(null, self);
    });
})

/**
 *  API
 */
exports.requeue_message = requeue_message
