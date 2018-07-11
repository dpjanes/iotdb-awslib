/**
 *  ecr/repository_get_by_name.js
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
 *  Produces: self.aws_result, self.repository
 */
const repository_get_by_name = _.promise.make((self, done) => {
    const method = "ecr.repository_get_by_name";

    assert.ok(self.ecr, `${method}: self.ecr is required`);
    assert.ok(_.is.String(self.name), `${method}: self.name is must be String`);

    self.ecr.describeRepositories({
        repositoryNames: [
            self.name,
        ],
    }, (error, data) => {
        if (error) {
            if (error.code === "RepositoryNotFoundException") {
                self.aws_result = null
                self.repository = null

                return done(null, self)
            }

            return done(error);
        }

        self.aws_result = data;
        self.repository = data.repositories.length ? data.repositories[0] : null

        done(null, self);
    });
})

/**
 *  API
 */
exports.repository_get_by_name = repository_get_by_name;
