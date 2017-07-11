/**
 *  sns/publish.js
 *
 *  David Janes
 *  IOTDB
 *  2017-07-11
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const Q = require("bluebird-q");

/**
 *  Accepts: self.sns, self.json, self.stream_name, self.partition_key
 *  Produces: N/A
 */
const publish = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "sns.publish";

    assert.ok(self.sns, `${method}: self.sns is required`);
    assert.ok(_.is.JSON(self.json), `${method}: self.json must be a JSONable Object`);
    assert.ok(_.is.String(self.stream_name), `${method}: self.stream_name is required`);
    assert.ok(_.is.String(self.partition_key), `${method}: self.partition_key is required`);

    self.sns.putRecord({
        Data: JSON.stringify(self.json, null, 0),
        PartitionKey: self.partition_key,
        StreamName: self.stream_name,
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        done(null, self);
    })
}

/**
 *  API
 */
exports.publish = Q.denodeify(publish);
