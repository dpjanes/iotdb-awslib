/**
 *  translate/translate.js
 *
 *  David Janes
 *  IOTDB
 *  2018-04-14
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

/**
 *  Requires: self.translate, self.document
 *  Produces: self.aws_result, self.document
 */
const translate = _.promise.make((self, done) => {
    const method = "translate.translate";

    assert.ok(self.translate, `${method}: self.translate is required`);
    assert.ok(_.is.String(self.document), `${method}: self.document must be a String`);
    assert.ok(_.is.String(self.from_language) || _.is.Nullish(self.from_language), 
        `${method}: self.from_language must be a String or Null`);
    assert.ok(_.is.String(self.to_language), `${method}: self.to_language must be a String`);

    self.translate.translateText({
        SourceLanguageCode: self.from_language || "en",
        TargetLanguageCode: self.to_language,
        Text: self.document,
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        assert.ok(data)
        assert.ok(data.TranslatedText)

        self.aws_result = data;
        self.document = data.TranslatedText;

        done(null, self);
    });
})

/**
 *  API
 */
exports.translate = translate;
