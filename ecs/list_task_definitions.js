/**
 *  ecs/list_task_definitions.js
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
 *  Produces: self.aws_result, self.task_definitions
 */
const list_task_definitions = _.promise.make((self, done) => {
    const method = "ecs.list_task_definitions";

    assert.ok(self.ecs, `${method}: self.ecs is required`);

    self.ecs.listTaskDefinitions((error, data) => {
        if (error) {
            return done(error);
        }

        assert.ok(data)
        assert.ok(data.taskDefinitionArns)

        self.aws_result = data;
        self.task_definitions = data.taskDefinitionArns;

        done(null, self);
    });
})

/**
 *  API
 */
exports.list_task_definitions = list_task_definitions;
