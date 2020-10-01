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
const syntax = _.promise((self, done) => {
    _.promise.validate(self, syntax)

    self.aws$comprehend.detectSyntax({
        LanguageCode: self.from_language || "en",
        Text: self.document,
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        self.aws$result = data
        self.tokens = data.SyntaxTokens

        done(null, self)
    });
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
    document: _.is.String,
}
syntax.p = _.p(syntax)

/**
 *  API
 */
exports.syntax = syntax;
