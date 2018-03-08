/**
 *  route53/resource.js
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
const resource = action => _.promise.make((self, done) => {
    const method = "route53.resource";

    assert.ok(self.route53, `${method}: self.route53 is required`);
    assert.ok(_.is.Dictionary(self.zone), `${method}: self.zone is required`);
    assert.ok(_.is.Dictionary(self.resource), `${method}: self.resource is required`);

    self.route53.changeResourceRecordSets({
        HostedZoneId: self.zone.Id,
        ChangeBatch: {
            Changes: [
                {
                    Action: action,
                    ResourceRecordSet: self.resource,
                },
            ],
        },
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        assert.ok(data)

        self.aws_result = data;

        done(null, self);
    });
})

/**
 *  A Record
 */
const make_A = (name, ips, ttl) => _.promise.make(self => {
    self.resource = {
        Type: "A",
        Name: name,
        ResourceRecords: [],
        TTL: ttl || 60,
    }

    _.coerce.list(ips, []).forEach(ip => {
        self.resource.ResourceRecords.push({
            Value: ip,
        })
    })
})

/**
 *  API
 */
exports.resource = {}
exports.resource.create = resource("CREATE");
exports.resource.delete = resource("DELETE");
exports.resource.upsert = resource("UPSERT");
exports.resource.A = make_A;
