/**
 *  ecs/describe_task.js
 *
 *  David Janes
 *  IOTDB
 *  2018-03-06
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

/**
 *  Requires: self.ecs, 
 *  Produces: self.aws_result, self.task_description
 */
const describe_task = _.promise.make((self, done) => {
    const method = "ecs.describe_task";

    assert.ok(self.ecs, `${method}: self.ecs is required`);
    assert.ok(_.is.String(self.task), `${method}: self.task is required`);

    self.ecs.describeTasks({
        cluster: self.cluster,
        tasks: [ self.task ],
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        assert.ok(data)
        assert.ok(data.tasks)

        self.aws_result = data;
        self.task_description = data.tasks.length ? data.tasks[0] : null;

        done(null, self);
    });
})

/**
 *  API
 */
exports.describe_task = describe_task;
