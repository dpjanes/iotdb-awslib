/**
 *  sqs/get_queue_url.js
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
const get_queue_url = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "sqs.get_queue_url";

    assert.ok(self.sqs, `${method}: self.sqs is required`);

    self.sqs.getQueueUrl({
        QueueName: self.queue_name,
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        self.queue_url = data.QueueUrl;

        return done(null, self);
    });
}

/**
 *  API
 */
exports.get_queue_url = Q.denodeify(get_queue_url);
