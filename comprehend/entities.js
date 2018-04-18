/**
 *  comprehend/entities.js
 *
 *  David Janes
 *  IOTDB
 *  2018-04-18
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

/**
 *  Requires: self.comprehend, self.document
 *  Produces: self.aws_result, self.document
 */
const entities = _.promise.make((self, done) => {
    const method = "comprehend.entities";

    assert.ok(self.comprehend, `${method}: self.comprehend is required`);
    assert.ok(_.is.String(self.document), `${method}: self.document must be a String`);
    assert.ok(_.is.String(self.from_language) || _.is.Nullish(self.from_language), 
        `${method}: self.from_language must be a String or Null`);

    self.comprehend.detectEntities({
        LanguageCode: self.from_language || "en",
        Text: self.document,
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        assert.ok(data)
        assert.ok(data.Entities)

        self.aws_result = data;
        self.entities = data.Entities

        done(null, self);
    });
})

/**
 *  API
 */
exports.entities = entities;
