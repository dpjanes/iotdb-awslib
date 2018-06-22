/**
 *  ecr/create_repository.js
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
const create_repository = _.promise.make((self, done) => {
    const method = "ecr.create_repository";

    assert.ok(self.ecr, `${method}: self.ecr is required`);
    assert.ok(_.is.String(self.name), `${method}: self.name is must be String`);

    self.ecr.createRepository({
        repositoryName: self.name,
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        self.aws_result = data;
        self.repository = data.repository || null;

        done(null, self);
    });
})

/**
 *  API
 */
exports.create_repository = create_repository;
