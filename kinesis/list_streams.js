/**
 *  kinesis/list_streams.js
 *
 *  David Janes
 *  IOTDB
 *  2017-12-14
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");


/**
 *  Accepts: self.kinesis, self.json, self.stream_name, self.partition_key
 *  Produces: N/A
 */
const list_streams = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "kinesis.list_streams";

    assert.ok(self.kinesis, `${method}: self.kinesis is required`);
    assert.ok(_.is.JSON(self.json), `${method}: self.json must be a JSONable Object`);

    self.kinesis.listStreams({
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
exports.list_streams = _.promise.denodeify(list_streams);
