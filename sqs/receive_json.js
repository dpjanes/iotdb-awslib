/**
 *  sqs/receive_json.js
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
const receive_json = _.promise.make((self, done) => {
    const method = "sqs.receive_json";

    const delete_message = require("./delete_message").delete_message;

    assert.ok(self.sqs, `${method}: self.sqs is required`);
    assert.ok(_.is.String(self.queue_url), `${method}: self.queue_url must be a String`);
    assert.ok(_.is.Number(self.timeout) || !self.timeout, `${method}: self.timeout must be a Number or Null`);

    self.sqs.receiveMessage({
        QueueUrl: self.queue_url,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: _.is.Number(self.timeout) ? self.timeout : 15,
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        self.message = null;
        self.json = null;

        if (data.Messages) {
            self.message = data.Messages[0];

            try {
                self.json = JSON.parse(self.message.Body);
            } catch (x) {
                self.message = null;

                self.sqs.deleteMessage({
                    QueueUrl: self.queue_url,
                    ReceiptHandle: data.Messages[0].ReceiptHandle,
                }, (error, data) => {
                })
            }
        }

        return done(null, self);
    });
})

/**
 *  API
 */
exports.receive_json = receive_json
