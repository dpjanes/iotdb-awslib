/**
 *  route53/list_resources.js
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
 *  Requires: self.route53, self.zone
 *  Accepts: self.resource_name, self.resource_type
 *  Produces: self.aws_result, self.resources
 */
const list_resources = _.promise.make((self, done) => {
    const method = "route53.list_resources";

    assert.ok(self.route53, `${method}: self.route53 is required`);
    assert.ok(_.is.Dictionary(self.zone), `${method}: self.zone is required`);

    self.route53.listResourceRecordSets({
        HostedZoneId: self.zone.Id,
        StartRecordName: self.resource_name || null,
        StartRecordType: self.resource_type || null,
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        assert.ok(data)
        assert.ok(data.ResourceRecordSets)

        self.aws_result = data;
        self.resources = data.ResourceRecordSets;

        done(null, self);
    });
})

/**
 *  API
 */
exports.list_resources = list_resources;
