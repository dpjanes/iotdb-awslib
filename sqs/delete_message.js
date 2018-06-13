/**
 *  sqs/delete_message.js
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

/**
 *  Accepts: 
 *  Produces:
 */
const delete_message = _.promise.make((self, done) => {
    const method = "sqs.delete_message";

    assert.ok(self.sqs, `${method}: self.sqs is required`);
    assert.ok(_.is.String(self.queue_url), `${method}: self.queue_url must be a String`);

    if (!self.message) {
        return done(null, self);
    }

    self.sqs.deleteMessage({
        QueueUrl: self.queue_url,
        ReceiptHandle: self.message.ReceiptHandle,
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
exports.delete_message = delete_message
