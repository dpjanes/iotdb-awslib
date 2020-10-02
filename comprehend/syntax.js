/**
 *  comprehend/syntax.js
 *
 *  David Janes
 *  IOTDB
 *  2020-09-30
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict"

const _ = require("iotdb-helpers")

/**
 */
const _token = d => ({
    document: d.Text,
    token: "pos",
    start: d.BeginOffset,
    end: d.EndOffset,

    tag: d.PartOfSpeech.Tag,
    score: d.PartOfSpeech.Score,
})

/**
 */
const syntax = _.promise((self, done) => {
    _.promise(self)
        .validate(syntax)

        .make(sd => {
            sd.in = {
                LanguageCode: sd.from_language || "en",
                Text: sd.document,
            }
        })
        .wrap(self.aws$comprehend.detectSyntax.bind(self.aws$comprehend), "in", "aws$result")
        .make(sd => {
            sd.tokens = sd.aws$result.SyntaxTokens.map(_token)
        })

        .end(done, self, syntax)
})

syntax.method = "comprehend.syntax"
syntax.description = ``
syntax.requires = {
    aws$comprehend: _.is.Object,
    document: _.is.String,
}
syntax.accepts = {
    from_language: _.is.String,
}
syntax.produces = {
    tokens: _.is.Array.of.Dictionary,
    aws$result: _.is.Object,
}
syntax.params = {
    document: _.p.normal,
}
syntax.p = _.p(syntax)

/**
 */
const syntax_batch = _.promise((self, done) => {
    _.promise(self)
        .validate(syntax)

        .make(sd => {
            sd.in = {
                LanguageCode: sd.from_language || "en",
                TextList: sd.documents,
            }
        })
        .wrap(self.aws$comprehend.detectSyntax.bind(self.aws$comprehend), "in", "aws$result")
        .make(sd => {
            sd.tokenss = sd.aws$result.ResultList.map(d => d.SyntaxTokens.map(_tokem))
        })

        .end(done, self, syntax)
})

syntax_batch.method = "comprehend.syntax.batch"
syntax_batch.description = ``
syntax_batch.requires = {
    aws$comprehend: _.is.Object,
    documents: _.is.Array.of.String,
}
syntax_batch.accepts = {
    from_language: _.is.String,
}
syntax_batch.produces = {
    tokenss: _.is.Array.of.Dictionary,
    aws$result: _.is.Object,
}
syntax_batch.params = {
    documents: _.p.normal,
}
syntax_batch.p = _.p(syntax_batch)

/**
 *  API
 */
exports.syntax = syntax
exports.syntax.batch = syntax_batch
