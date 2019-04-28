/**
 *  s3/get_object.js
 *
 *  David Janes
 *  IOTDB
 *  2017-01-19
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict";

const _ = require("iotdb-helpers")

const assert = require("assert")

const AWS = require("aws-sdk")

/**
 */
const get_object = _.promise((self, done) => {
    self.s3.getObject({
        Bucket: self.bucket,
        Key: self.key,
    }, (error, data) => {
        if (error) {
            return done(error);
        }

        self.aws_result = data;

        if (_.is.String(data.Body)) {
            self.document = data.Body;

            if (data.ContentEncoding) {
                self.document_encoding = data.ContentEncoding;
            }
        } else if (_.is.Buffer(data.Body)) {
            if (data.ContentEncoding) {
                self.document = data.Body.toString(data.ContentEncoding);
                self.document_encoding = data.ContentEncoding;
            } else {
                self.document = data.Body;
                self.document_encoding = null;
            }
        } else {
            assert.ok(false, `${get_object.method}: don't know how to deal with Body of type: ${typeof data.Body}`);
        }

        assert.ok(self.document, `${get_object.method}: self.document should have been produced by now`);

        if (data.ContentType) {
            self.document_media_type = data.ContentType;
        }

        done(null, self);
    });
})
get_object.method = "s3.get_object"
get_object.requires = {
    s3: _.is.Object,
    bucket: _.is.String,
    key: _.is.String,
}

/**
 *  API
 */
exports.get_object = get_object

