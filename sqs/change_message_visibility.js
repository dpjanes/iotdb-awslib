/**
 *  sqs/change_message_visibility.js
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
 *  Accepts: self.sqs, self.message, self.queue_url, self.timeout (seconds)
 *  Produces:
 */
const change_message_visibility = _.promise.make((self, done) => {
    const method = "sqs.change_message_visibility";

    assert.ok(self.sqs, `${method}: self.sqs is required`);
    assert.ok(_.is.String(self.queue_url), `${method}: self.queue_url must be a String`);
    assert.ok(_.is.Number(self.timeout), `${method}: self.timeout must be a Number`);

    if (!self.message) {
        return done(null, self);
    }

    self.sqs.changeMessageVisibility({
        QueueUrl: self.queue_url,
        ReceiptHandle: self.message.ReceiptHandle,
        VisibilityTimeout: self.timeout,
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
exports.change_message_visibility = change_message_visibility
