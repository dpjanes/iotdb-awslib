/**
 *  sqs/list_queues.js
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
const list_queues = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "sqs.list_queues";

    assert.ok(self.sqs, `${method}: self.sqs is required`);

    self.sqs.listQueues({
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        self.queue_urls = data.QueueUrls;

        return done(null, self);
    });
}

/**
 *  API
 */
exports.list_queues = Q.denodeify(list_queues);
