/**
 *  sqs/receive_messages.js
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
const receive_messages = _.promise.make((self, done) => {
    const method = "sqs.receive_messages";

    assert.ok(self.sqs, `${method}: self.sqs is required`);
    assert.ok(_.is.String(self.queue_url), `${method}: self.queue_url must be a String`);
    assert.ok(_.is.Integer(self.max_messages) || !self.delay, `${method}: self.max_messages must be a Integer or Null`);
    assert.ok(_.is.Number(self.timeout) || !self.timeout, `${method}: self.timeout must be a Number or Null`);

    self.sqs.receiveMessage({
        QueueUrl: self.queue_url,
        MaxNumberOfMessages: self.max_messages || 1,
        WaitTimeSeconds: _.is.Number(self.timeout) ? self.timeout : 15,
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        self.messages = data.Messages;

        return done(null, self);
    });
})

/**
 *  API
 */
exports.receive_messages = receive_messages
