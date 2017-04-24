/**
 *  sqs/requeue_message.js
 *
 *  David Janes
 *  IOTDB
 *  2017-04-24
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const AWS = require("aws-sdk");
const Q = require("q");

/**
 *  Accepts: self.sqs, self.message, self.queue_url
 *  Produces:
 *
 *  Changes message visibility to 0, making it available to
 *  other queue proccessors
 */
const requeue_message = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "sqs.requeue_message";

    assert.ok(self.sqs, `${method}: self.sqs is required`);
    assert.ok(self.message, `${method}: self.message is required`);
    assert.ok(_.is.String(self.queue_url), `${method}: self.queue_url must be a String`);

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
}

/**
 *  API
 */
exports.requeue_message = Q.denodeify(requeue_message);
