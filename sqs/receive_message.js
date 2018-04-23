/**
 *  sqs/receive_message.js
 *
 *  David Janes
 *  IOTDB
 *  2017-01-30
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const AWS = require("aws-sdk");

/**
 *  Accepts: 
 *  Produces:
 */
const receive_message = _.promise.make((self, done) => {
    const method = "sqs.receive_message";

    assert.ok(self.sqs, `${method}: self.sqs is required`);
    assert.ok(_.is.String(self.queue_url), `${method}: self.queue_url must be a String`);
    assert.ok(_.is.Number(self.timeout) || !self.timeout, `${method}: self.timeout must be a Number or Null`);

    self.sqs.receiveMessage({
        QueueUrl: self.queue_url,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: _.is.Number(self.timeout) ? self.timeout : 15,
        AttributeNames: [ "All" ],
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        self.message = null;
    
        if (data.Messages) {
            self.message = data.Messages[0];
        }

        return done(null, self);
    });
})

/**
 *  API
 */
exports.receive_message = receive_message
