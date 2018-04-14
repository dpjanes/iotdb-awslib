/**
 *  translate/translate.js
 *
 *  David Janes
 *  IOTDB
 *  2018-04-14
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

/**
 *  Requires: self.ecs, self.document
 *  Produces: self.aws_result, self.document
 */
const translate = _.promise.make((self, done) => {
    const method = "ecs.translate";

    assert.ok(self.ecs, `${method}: self.ecs is required`);
    assert.ok(_.is.String(self.document), `${method}: self.document is required`);

    self.ecs.listTasks({
        document: self.document,
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
exports.translate = translate;
