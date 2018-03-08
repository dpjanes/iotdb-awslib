/**
 *  route53/find_hosted_zone.js
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
 *  Requires: self.route53, self.name
 *  Accepts: self.private
 *  Produces: self.aws_result, self.zone
 */
const find_hosted_zone = _.promise.make(self => {
    const method = "route53.find_hosted_zone";

    assert.ok(self.route53, `${method}: self.route53 is required`);
    assert.ok(_.is.Array(self.zones), `${method}: self.zones is required`);
    assert.ok(_.is.String(self.name), `${method}: self.name is required`);

    self.zone = self.zones.find(zone => {
        if (zone.Name !== self.name) {
            return
        }

        if (_.is.Nullish(self.private)) {
            return true
        }

        if (self.private === zone.Config.PrivateZone) {
            return true
        }
    }) || null
})

/**
 *  API
 */
exports.find_hosted_zone = find_hosted_zone;
