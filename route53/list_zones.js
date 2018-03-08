/**
 *  route53/list_zones.js
 *
 *  David Janes
 *  IOTDB
 *  2018-03-08
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict"

const _ = require("iotdb-helpers")

const assert = require("assert")

/**
 *  Requires: self.route53, 
 *  Produces: self.aws_result, self.zones
 */
const list_zones = _.promise.make((self, done) => {
    const method = "route53.list_zones";

    assert.ok(self.route53, `${method}: self.route53 is required`);

    self.route53.listHostedZones((error, data) => {
        if (error) {
            return done(error);
        }

        assert.ok(data)
        assert.ok(data.HostedZones)

        self.aws_result = data;
        self.zones = data.HostedZones;

        done(null, self);
    });
})

/**
 *  API
 */
exports.list_zones = list_zones;
