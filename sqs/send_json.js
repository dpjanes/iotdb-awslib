/**
 *  sqs/send_json.js
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
const send_json = _.promise.make((self, done) => {
    const method = "sqs.send_json";

    assert.ok(self.sqs, `${method}: self.sqs is required`);
    assert.ok(_.is.JSON(self.json), `${method}: self.json must be a JSONable Object`);
    assert.ok(_.is.String(self.queue_url), `${method}: self.queue_url must be a String`);
    assert.ok(_.is.Number(self.delay) || !self.delay, `${method}: self.delay must be a Number or Null`);
    assert.ok(_.is.String(self.queue_url), `${method}: self.queue_url must be a String`);

    const paramd = {
        QueueUrl: self.queue_url,
        MessageBody: JSON.stringify(self.json, null, 0),
        DelaySeconds: self.delay || null,
    }

    if (self.queue_url.endsWith(".fifo")) {
        assert.ok(_.is.String(self.message_group_id), `${method}: self.message_group_id must be a String`);

        paramd.MessageGroupId = self.message_group_id
    }

    self.sqs.sendMessage(paramd, (error, data) => {
        if (error) {
            return done(error);
        }

        return done(null, self);
    });
})

/**
 *  API
 */
exports.send_json = send_json
