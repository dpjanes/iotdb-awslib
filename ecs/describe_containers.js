/**
 *  ecs/describe_containers.js
 *
 *  David Janes
 *  IOTDB
 *  2018-12-29
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict"

const _ = require("iotdb-helpers")

const assert = require("assert")

/**
 *  Requires: self.ecs, self.containers
 *  Produces: self.aws_result, self.containers, self.container
 */
const describe_containers = _.promise((self, done) => {
    _.promise.validate(self, describe_containers)

    if (self.containers.length === 0) {
        self.aws_result = null
        self.containers = []
        self.container = null

        return done(null, self)
    }

    self.ecs.describeContainerInstances({
        cluster: self.cluster,
        containerInstances: self.containers.map(c => _.is.String(c) ? c : c.containerInstanceArn),
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        assert.ok(data)
        assert.ok(data.containerInstances)

        self.aws_result = data;
        self.containers = data.containerInstances;
        self.container = data.containerInstances.length ? data.containerInstances[0] : null;

        done(null, self);
    });
})

describe_containers.method = "ecs.describe_containers"
describe_containers.requires = {
    ecs: _.is.Object,
    containers: [ _.is.Array.of.String, _.is.Array.of.Dictionary ],
}

/**
 *  API
 */
exports.describe_containers = describe_containers;
