/**
 *  sqs/process_json.js
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
const Q = require("q");

/**
 *  Accepts: 
 *  Produces:
 */
const process_json = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "sqs.process_json";

    assert.ok(self.sqs, `${method}: self.sqs is required`);
    assert.ok(_.is.JSON(self.json), `${method}: self.json must be a JSONable Object`);
    assert.ok(_.is.String(self.queue_url), `${method}: self.queue_url must be a String`);
    assert.ok(_.is.Integer(self.max_messages) || !self.delay, `${method}: self.max_messages must be a Integer or Null`);

    assert.ok(_.is.Function(self.handle_error) || !self.handle_error, `${method}: self.handle_error must be a Function or Null`);
    assert.ok(_.is.Function(self.handle_failure) || !self.handle_failure, `${method}: self.handle_failure must be a Function or Null`);
    assert.ok(_.is.Function(self.handle_message), `${method}: self.handle_message must be a Function`);

    self.handle_error = self.handle_error || _.noop;
    self.handle_failure = self.handle_failure || _.noop;

    done(null, self);

    while (true) {
        self.sqs.receiveMessage({
            QueueUrl: self.queue_url,
            MaxNumberOfMessages: self.max_messages || 1,
        }, (error, data) => {
            if (error) {
                console.log("#", "queue flaked out", self.queue_url);
                break;
            }

            data.Messages.forEach(message => {
                const message_self = _.d.clone.shallow(_self);
                message_self.json = JSON.parse(message.Body);
                message_self.message_id = message.MessageId;

                Q(message)
                    .then(self.handle_message)
                    .then(() => {
                    })
                    .catch(self.handle_failure)
            })

             ReceiptHandle: data.Messages[0].ReceiptHandle
        }
    })
}

/**
 *  API
 */
exports.process_json = Q.denodeify(process_json);
