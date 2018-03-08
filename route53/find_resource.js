/**
 *  route53/find_resource.js
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
 *  Requires: self.route53, self.resource_name
 *  Accepts: self.resource_private
 *  Produces: self.aws_result, self.resource
 */
const find_resource = _.promise.make(self => {
    const method = "route53.find_resource";

    assert.ok(self.route53, `${method}: self.route53 is required`);
    assert.ok(_.is.Array(self.resources), `${method}: self.resources is required`);
    assert.ok(_.is.String(self.resource_name), `${method}: self.resource_name is required`);

    self.resource = self.resources.find(resource => {
        if (resource.Name !== self.resource_name) {
            return
        }

        return true
    }) || null
})

/**
 *  API
 */
exports.find_resource = find_resource;
