/**
 *  ecr/describe_repository.js
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
 *  Requires: self.describe_repository, self.document
 *  Produces: self.aws_result, self.document
 */
const describe_repository = _.promise.make((self, done) => {
    const method = "ecr.describe_repository";

    assert.ok(self.ecr, `${method}: self.ecr is required`);
    assert.ok(_.is.String(self.document), `${method}: self.document must be a String`);
    assert.ok(_.is.String(self.from_language) || _.is.Nullish(self.from_language), 
        `${method}: self.from_language must be a String or Null`);

    self.ecr.detectSentiment({
        LanguageCode: self.from_language || "en",
        Text: self.document,
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        assert.ok(data)
        assert.ok(data.Sentiment)
        assert.ok(data.SentimentScore)

        self.aws_result = data;

        self.describe_repository = data.Sentiment
        self.score = data.SentimentScore

        done(null, self);
    });
})

/**
 *  API
 */
exports.describe_repository = describe_repository;
