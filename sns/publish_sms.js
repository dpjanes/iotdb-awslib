/**
 *  sns/publish_sms.js
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
 *  Accepts: self.sns, self.document, self.to_phone
 *  Produces: self.aws_result
 */
const publish_sms = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "sns.publish_sms";

    assert.ok(self.sns, `${method}: self.sns is required`);
    assert.ok(_.is.String(self.document), `${method}: self.document must be a String`)
    assert.ok(_.is.String(self.to_phone), `${method}: self.to_phone must be a String`)

    const d = {
        Message: self.document,
        PhoneNumber: self.to_phone,
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
exports.publish_sms = Q.denodeify(publish_sms);
