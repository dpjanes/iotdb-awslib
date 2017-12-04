/**
 *  ecs/run_task.js
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
 *  Requires: self.ecs, self.task_definition, self.cluster
 *  Produces: self.aws_result
 */
const run_task = _.promise.make((self, done) => {
    const method = "ecs.run_task";

    assert.ok(self.ecs, `${method}: self.ecs is required`);
    assert.ok(self.task_definition, `${method}: self.task_definition is required`);
    assert.ok(self.cluster, `${method}: self.cluster is required`);

    self.ecs.stopTask({
        cluster: self.cluster,
        task_definition: self.task_definition,
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
exports.run_task = run_task;
