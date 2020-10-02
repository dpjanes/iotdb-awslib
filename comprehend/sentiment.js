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

const _token = (ss, document) => {
    const token = {
        document: document,
        token: "sentiment",
        start: 0,
        end: document.length,
        tag: null,
        score: -1,
        sentiment: {},
    }

    _.mapObject(ss, (value, key) => {
        key = key.toLowerCase()

        token.sentiment[key] = value
        if (value > token.score) {
            token.tag = key
            token.score = value
        }
    })

    return token
}

/**
 */
const sentiment = _.promise((self, done) => {
    _.promise(self)
        .validate(sentiment)

        .make(sd => {
            sd.in = {
                LanguageCode: sd.from_language || "en",
                Text: sd.document,
            }
        })
        .wrap(self.aws$comprehend.detectSentiment.bind(self.aws$comprehend), "in", "aws$result")
        .make(sd => {
            sd.token = _token(sd.aws$result.SentimentScore, sd.document)
        })

        .end(done, self, sentiment)
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
    aws$result: _.is.Object,
    token: _.is.Dictionary,
}
sentiment.params = {
    document: _.is.String,
}
sentiment.p = _.p(sentiment)

/**
 */
const sentiment_batch = _.promise((self, done) => {
    _.promise(self)
        .validate(sentiment_batch)

        .make(sd => {
            sd.in = {
                LanguageCode: sd.from_language || "en",
                TextList: sd.documents,
            }
        })
        .wrap(self.aws$comprehend.batchDetectSentiment.bind(self.aws$comprehend), "in", "aws$result")
        .make(sd => {
            sd.tokens = sd.aws$result.ResultList.map((d, x) => _token(d.SentimentScore, sd.documents[x]))
        })

        .end(done, self, sentiment_batch)
})

sentiment_batch.method = "comprehend.sentiment.batch"
sentiment_batch.description = ``
sentiment_batch.requires = {
    aws$comprehend: _.is.Object,
    documents: _.is.Array.of.String,
}
sentiment_batch.accepts = {
    from_language: _.is.String,
}
sentiment_batch.produces = {
    tokens: _.is.Array,
    aws$result: _.is.Object,
}
sentiment_batch.params = {
    documents: _.p.normal,
}
sentiment_batch.p = _.p(sentiment_batch)

/**
 *  API
 */
exports.sentiment = sentiment
exports.sentiment.batch = sentiment_batch
