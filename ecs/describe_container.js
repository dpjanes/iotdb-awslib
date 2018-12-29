/**
 *  ecs/describe_container.js
 *
 *  David Janes
 *  IOTDB
 *  2018-12-29
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

/**
 *  Requires: self.ecs, self.container
 *  Produces: self.aws_result, self.container
 */
const describe_container = _.promise((self, done) => {
    _.promise.validate(self, describe_containers)

    self.ecs.describeContainerInstances({
        cluster: self.cluster,
        containers: [ self.container ].map(c => _.is.String(c) ? c : c.containerInstanceArn),
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        assert.ok(data)
        assert.ok(data.containerInstances)

        self.aws_result = data;
        self.container = data.containerInstances.length ? data.containerInstances[0] : null;

        done(null, self);
    });
})

describe_container.method = "ecs.describe_container"
describe_container.requires = {
    ecs: _.is.Object,
    container: [ _.is.String, _.is.Dictionary ],
}

/**
 *  API
 */
exports.describe_container = describe_container;
