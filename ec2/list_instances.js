/**
 *  ec2/list_instances.js
 *
 *  David Janes
 *  IOTDB
 *  2018-03-15
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict"

const _ = require("iotdb-helpers")

const assert = require("assert")

/**
 *  Requires: self.ec2, 
 *  Produces: self.aws_result, self.instances
 */
const list_instances = _.promise.make((self, done) => {
    const method = "ec2.list_instances";

    assert.ok(self.ec2, `${method}: self.ec2 is required`);

    self.ec2.listHostedZones((error, data) => {
        if (error) {
            return done(error);
        }

        assert.ok(data)
        assert.ok(data.HostedZones)

        self.aws_result = data;
        self.instances = data.HostedZones;

        done(null, self);
    });
})

/**
 *  API
 */
exports.list_instances = list_instances;
