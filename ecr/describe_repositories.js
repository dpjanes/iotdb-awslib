/**
 *  ecr/describe_repositories.js
 *
 *  David Janes
 *  IOTDB
 *  2018-06-22
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict"

const _ = require("iotdb-helpers")

const assert = require("assert")

/**
 *  Requires: 
 *  Produces: self.aws_result, self.repositories
 */
const describe_repositories = _.promise.make((self, done) => {
    const method = "ecr.describe_repositories";

    assert.ok(self.ecr, `${method}: self.ecr is required`);

    self.ecr.describeRepositories({
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        self.aws_result = data;
        self.repositories = data.repositories;

        done(null, self);
    });
})

/**
 *  API
 */
exports.describe_repositories = describe_repositories;
