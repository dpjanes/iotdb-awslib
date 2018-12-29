/**
 *  ecs/describe_tasks.js
 *
 *  David Janes
 *  IOTDB
 *  2018-03-06
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict"

const _ = require("iotdb-helpers")

const assert = require("assert")

/**
 *  Requires: self.ecs, self.tasks
 *  Produces: self.aws_result, self.task_descriptions, self.task_description
 */
const describe_tasks = _.promise((self, done) => {
    _.promise.validate(self, describe_tasks)

    if (self.tasks.length === 0) {
        self.aws_result = null
        self.task_descriptions = []
        self.task_description = null

        return done(null, self)
    }

    self.ecs.describeTasks({
        cluster: self.cluster,
        tasks: self.tasks,
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        assert.ok(data)
        assert.ok(data.tasks)

        self.aws_result = data;
        self.task_descriptions = data.tasks;
        self.task_description = data.tasks.length ? data.tasks[0] : null;

        done(null, self);
    });
})

describe_tasks.method = "ecs.describe_tasks"
describe_tasks.requires = {
    ecs: _.is.Object,
    tasks: _.is.Array.of.String,
}

/**
 *  API
 */
exports.describe_tasks = describe_tasks;
