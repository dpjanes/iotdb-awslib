/**
 *  comprehend/entities.js
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
const _token = d => ({
    document: d.Text,
    token: "entity",
    start: d.BeginOffset,
    end: d.EndOffset,

    tag: d.Type,
    score: d.Score,
})

/**
 */
const entities = _.promise((self, done) => {
    _.promise(self)
        .validate(entities)

        .make(sd => {
            sd.in = {
                LanguageCode: sd.from_language || "en",
                Text: sd.document,
            }
        })
        .wrap(self.aws$comprehend.detectEntities.bind(self.aws$comprehend), "in", "aws$result")
        .make(sd => {
            sd.tokens = sd.aws$result.Entities.map(_token)
        })

        .end(done, self, entities)
})

entities.method = "comprehend.entities"
entities.description = ``
entities.requires = {
    aws$comprehend: _.is.Object,
    document: _.is.String,
}
entities.accepts = {
    from_language: _.is.String,
}
entities.produces = {
    tokens: _.is.Array.of.Dictionary,
    aws$result: _.is.Object,
}
entities.params = {
    document: _.is.String,
}
entities.p = _.p(entities)

/**
 */
const entities_batch = _.promise((self, done) => {
    _.promise(self)
        .validate(entities_batch)

        .make(sd => {
            sd.in = {
                LanguageCode: sd.from_language || "en",
                TextList: sd.documents,
            }
        })
        .wrap(self.aws$comprehend.batchDetectEntities.bind(self.aws$comprehend), "in", "aws$result")
        .make(sd => {
            sd.tokenss = sd.aws$result.ResultList.map(d => d.Entities.map(_token))
        })

        .end(done, self, entities_batch)
})

entities_batch.method = "comprehend.entities.batch"
entities_batch.description = ``
entities_batch.requires = {
    aws$comprehend: _.is.Object,
    documents: _.is.Array.of.String,
}
entities_batch.accepts = {
    from_language: _.is.String,
}
entities_batch.produces = {
    tokenss: _.is.Array,
    aws$result: _.is.Object,
}
entities_batch.params = {
    documents: _.p.normal,
}
entities_batch.p = _.p(entities_batch)

/**
 *  API
 */
exports.entities = entities
exports.entities.batch = entities_batch
