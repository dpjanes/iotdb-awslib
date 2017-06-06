/**
 *  sqs/receive_jsons.js
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

const Q = require("bluebird-q");
const async = require("async");

/**
 *  Accepts: 
 *  Produces: self.messages, self.jsons
 *
 *  This is a lot longer than it has to be to deal
 *  with unparsable messages are rarely if ever 
 *  going to show up.
 */
const receive_jsons = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "sqs.receive_jsons";

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

        self.messages = [];
        self.jsons = []

        const rejects = []

        data.Messages.forEach(message => {
            try {
                self.jsons.push(JSON.parse(message.Body));
                self.messages.push(message);
            } catch (x) {
                rejects.push(message)
            }
        })

        const ops = rejects.map(reject => inner_done => {
            self.sqs.deleteMessage({
                QueueUrl: self.queue_url,
                ReceiptHandle: reject.ReceiptHandle,
            }, (error, data) => {
                inner_done();
            })
        });

        async.series(ops, () => done(null, self))
    });
}

/**
 *  API
 */
exports.receive_jsons = Q.denodeify(receive_jsons);
