/**
 *  comprehend/sentiment.js
 *
 *  David Janes
 *  IOTDB
 *  2018-04-18
 *
 *  Copyright (2013-2021) David Janes
 */

"use strict"

const _ = require("iotdb-helpers")

/**
 */
const sentiment = _.promise((self, done) => {
    _.promise.validate(self, sentiment)

    self.aws$comprehend.detectSentiment({
        LanguageCode: self.from_language || "en",
        Text: self.document,
    }, (error, data) => {
        if (error) {
            return done(error)
        }

        self.aws$result = data
        self.sentiment = data.Sentiment
        self.score = data.SentimentScore

        done(null, self)
    })
})

sentiment.method = "comprehend.sentiment"
sentiment.description = ``
sentiment.requires = {
    aws$comprehend: _.is.Object,
    document: _.is.String,
}
sentiment.accepts = {
    from_language: _.is.String,
}
sentiment.produces = {
    tokens: _.is.Array.of.Dictionary,
    aws$result: _.is.Object,
    score: _.is.Number,
}
sentiment.params = {
    document: _.is.String,
}
sentiment.p = _.p(sentiment)

/**
 *  API
 */
exports.sentiment = sentiment
