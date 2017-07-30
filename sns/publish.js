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
 *  Accepts: self.sns, self.json, self.to_topic | self.to_target 
 *  Produces: self.aws_result
 */
const publish = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "sns.publish";

    assert.ok(self.sns, `${method}: self.sns is required`);
    assert.ok(_.is.JSON(self.json), `${method}: self.json must be a JSONable Object`);

    const d = {
        MessageStructure: 'json',
    }

    if (_.is.JSON(self.json)) {
        d.Message = JSON.stringify(self.json, null, 0)
    } else if (_.is.String(self.document)) {
        d.Message = JSON.stringify({
            default: self.document,
        }, null, 0)
    } else {
        assert(false, `${method}: self.json or self.document is required`)
    }

    if (_.is.String(self.to_topic)) {
        d.TopicArn = self.to_topic;
    } else if (_.is.String(self.to_target)) {
        d.TargetArn = self.to_target;
    }  else {
        assert(false, `${method}: self.to_topic or self.to_target is required`)
    }

    self.sns.publish(d, (error, data) => {
        if (error) {
            return done(error);
        }

        self.aws_result = data;

        done(null, self);
    })
}

/**
 *  API
 */
exports.publish = Q.denodeify(publish);
