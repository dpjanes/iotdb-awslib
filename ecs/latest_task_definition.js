/**
 *  ecs/latest_task_definition.js
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

const _filter = (ts, name) => {
    const key = `:task-definition/${name}:`

    return ts.filter(t => t.indexOf(key) !== -1)
}

const _sorter = (a, b) => {
    const am = a.match(/^(.*):(\d+)/)
    const as = am[1]
    const an = parseInt(am[2])

    const bm = b.match(/^(.*):(\d+)/)
    const bs = bm[1]
    const bn = parseInt(bm[2])

    if (as < bs) {
        return -1
    } else if (as > bs) {
        return 1
    }

    return an - bn
}

/**
 *  Requires: self.task_definitions, self.name
 *  Produces: self.task_definition
 *
 *  Return the latest added task_definition
 */
const latest_task_definition = _.promise.make(self => {
    const method = "ecs.latest_task_definition";

    assert.ok(self.ecs, `${method}: self.ecs is required`);
    assert.ok(_.is.Array.of.String(self.task_definitions), `${method}: self.task_definitions is required`);
    assert.ok(_.is.String(self.name), `${method}: self.name is required`);

    let task_definitions = _filter(self.task_definitions, self.name)
    task_definitions.sort(_sorter)

    if (task_definitions.length) {
        self.task_definition = task_definitions[task_definitions.length - 1]
    } else {
        self.task_definition = null
    }
})

const parameterized = name => _.promise.make((self, done) => {
    _.promise.make(self)
        .then(_.promise.add("name", name))
        .then(latest_task_definition)
        .then(_.promise.done(done, self, "task_definition"))
        .catch(done)
})

/**
 *  API
 */
exports.latest_task_definition = latest_task_definition;
exports.latest_task_definition.p = parameterized;


/*
let arns = [
  "arn:aws:ecs:us-east-1:061177153071:task-definition/ConsensasWebsite:6",
  "arn:aws:ecs:us-east-1:061177153071:task-definition/organization-9999:30",
  "arn:aws:ecs:us-east-1:061177153071:task-definition/organization-0001:1",
  "arn:aws:ecs:us-east-1:061177153071:task-definition/organization-9999:111",
  "arn:aws:ecs:us-east-1:061177153071:task-definition/organization-9999:2",
]


arns.sort(_sorter)
console.log(_filter(arns, "organization-9999"))
*/
