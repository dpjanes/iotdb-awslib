/**
 *  ecs/list_tasks.js
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
 *  Requires: self.ecs, 
 *  Produces: self.aws_result, self.tasks
 */
const list_tasks = _.promise.make((self, done) => {
    const method = "ecs.list_tasks";

    assert.ok(self.ecs, `${method}: self.ecs is required`);

    self.ecs.listTasks({
        cluster: self.cluster,
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        assert.ok(data)
        assert.ok(data.taskArns)

        self.aws_result = data;
        self.tasks = data.taskArns;

        done(null, self);
    });
})

/**
 *  API
 */
exports.list_tasks = list_tasks;
