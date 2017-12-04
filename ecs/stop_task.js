/**
 *  ecs/stop_task.js
 *
 *  David Janes
 *  IOTDB
 *  2017-12-04
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

/**
 *  Requires: self.ecs, self.task, self.cluster
 *  Produces: self.aws_result
 */
const stop_task = _.promise.make((self, done) => {
    const method = "ecs.stop_task";

    assert.ok(self.ecs, `${method}: self.ecs is required`);
    assert.ok(self.task, `${method}: self.task is required`);
    assert.ok(self.cluster, `${method}: self.cluster is required`);

    self.ecs.stopTask({
        cluster: self.cluster,
        task: self.task,
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        self.aws_result = data;

        done(null, self);
    });
})

/**
 *  API
 */
exports.stop_task = stop_task;
