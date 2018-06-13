/**
 *  sqs/requeue_messages.js
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

const async = require("async");

/**
 *  Accepts: self.sqs, self.message, self.queue_url
 *  Produces:
 */
const requeue_messages = _.promise.make((self, done) => {
    const method = "sqs.requeue_messages";

    assert.ok(self.sqs, `${method}: self.sqs is required`);
    assert.ok(_.is.String(self.queue_url), `${method}: self.queue_url must be a String`);
    assert.ok(_.is.Array(self.messages), `${method}: self.messages must be an Array`);

    const ops = self.messages.map(message => inner_done => {
        self.sqs.deleteMessage({
            QueueUrl: self.queue_url,
            ReceiptHandle: message.ReceiptHandle,
        }, (error, data) => {
            done()
        })
    });

    async.series(ops, () => done(null, self))
})

/**
 *  API
 */
exports.requeue_messages = requeue_messages
