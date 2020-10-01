/**
 *  comprehend/entities.js
 *
 *  David Janes
 *  IOTDB
 *  2018-04-18
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict"

const _ = require("iotdb-helpers")

/**
 */
const entities = _.promise((self, done) => {
    _.promise.validate(self, entities)

    self.aws$comprehend.detectEntities({
        LanguageCode: self.from_language || "en",
        Text: self.document,
    }, (error, data) => {
        if (error) {
            return done(error)
        }

        self.aws$result = data
        self.entities = data.Entities

        done(null, self)
    })
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
 *  API
 */
exports.entities = entities
