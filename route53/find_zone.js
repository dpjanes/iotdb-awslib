/**
 *  route53/find_zone.js
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
 *  Requires: self.route53, self.zone_name
 *  Accepts: self.zone_private
 *  Produces: self.aws_result, self.zone
 */
const find_zone = _.promise.make(self => {
    const method = "route53.find_zone";

    assert.ok(self.route53, `${method}: self.route53 is required`);
    assert.ok(_.is.Array(self.zones), `${method}: self.zones is required`);
    assert.ok(_.is.String(self.zone_name), `${method}: self.zone_name is required`);

    self.zone = self.zones.find(zone => {
        if (zone.Name !== self.zone_name) {
            return
        }

        if (_.is.Nullish(self.zone_private)) {
            return true
        }

        if (self.zone_private === zone.Config.PrivateZone) {
            return true
        }
    }) || null
})

/**
 *  API
 */
exports.find_zone = find_zone;
