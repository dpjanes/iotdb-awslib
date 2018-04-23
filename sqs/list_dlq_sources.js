/**
 *  sqs/list_dlq_sources.js
 *
 *  David Janes
 *  IOTDB
 *  2018-04-23
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
const list_dlq_sources = _.promise.make((self, done) => {
    const method = "sqs.list_dlq_sources";

    assert.ok(self.sqs, `${method}: self.sqs is required`);
    assert.ok(_.is.String(self.queue_url), `${method}: self.queue_url must be a String`);

    self.sqs.listDeadLetterSourceQueues({
        QueueUrl: self.queue_url,
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        self.queue_urls = []

        if (data.queueUrls) {
            self.queue_urls = data.queueUrls;
        }

        return done(null, self);
    });
})

/**
 *  API
 */
exports.list_dlq_sources = list_dlq_sources
