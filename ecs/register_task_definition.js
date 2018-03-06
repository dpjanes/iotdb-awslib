/**
 *  ecs/register_task_definition.js
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
 *  Produces: self.aws_result, self.task_definition
 */
const register_task_definition = _.promise.make((self, done) => {
    const method = "ecs.register_task_definition";

    assert.ok(self.ecs, `${method}: self.ecs is required`);
    assert.ok(_.is.Dictionary(self.task_definition), `${method}: self.task_definition is required`);

    self.ecs.registerTaskDefinition(self.task_definition, (error, data) => {
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
exports.register_task_definition = register_task_definition;
