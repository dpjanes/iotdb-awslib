/**
 *  sqs/send_json.js
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
const Q = require("bluebird-q");

/**
 *  Accepts: 
 *  Produces:
 */
const send_json = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "sqs.send_json";

    assert.ok(self.sqs, `${method}: self.sqs is required`);
    assert.ok(_.is.JSON(self.json), `${method}: self.json must be a JSONable Object`);
    assert.ok(_.is.String(self.queue_url), `${method}: self.queue_url must be a String`);
    assert.ok(_.is.Number(self.delay) || !self.delay, `${method}: self.delay must be a Number or Null`);

    self.sqs.sendMessage({
        QueueUrl: self.queue_url,
        MessageBody: JSON.stringify(self.json, null, 0),
        DelaySeconds: self.delay || null,
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
exports.send_json = Q.denodeify(send_json);
