/**
 *  ses/send.js
 *
 *  David Janes
 *  IOTDB
 *  2017-10-16
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const Q = require("bluebird-q");

/**
 *  Accepts: self.ses, self.json, self.email_from, self.partition_key
 *  Produces: N/A
 */
const send = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "ses.send";

    assert.ok(self.ses, `${method}: self.ses is required`);
    assert.ok(_.is.String(self.from), `${method}: self.from is required to be a String`);
    assert.ok(_.is.String(self.subject), `${method}: self.subject is required to be a String`);
    assert.ok(_.is.Array.of.String(self.tos) || _.is.String(self.to), 
        `${method}: self.to or self.tos are required to be Strings`);
    assert.ok(_.is.String(self.document), `${method}: self.document is required`);

    const message = {
        Source: self.from,
        Destination: {
            ToAddresses: self.tos || [ self.to ],
        },
        Message: {
            Subject: {
                Data: self.subject,
                Charset: "utf-8",
            },
            Body: {},
        },
    }

    const body = _.is.Buffer(self.document) ? self.document.toString("utf-8") : self.document;

    if (!self.document_media_type || (self.document_media_type == "text/plain")) {
        message.Message.Body.Text = {
            Data: body,
            Charset: "utf-8",
        }
    } else if (self.document_media_type == "text/html") {
        message.Message.Body.Html = {
            Data: body,
            Charset: "utf-8",
        }
    } else {
        assert.ok(false, `${method}: self.document_media_type must be Nullish or text/plain or text/html`);
    }

    self.ses.sendEmail(message, (error, data) => {
        console.log(JSON.stringify(message, null, 2))
        if (error) {
            return done(error);
        }

        done(null, self);
    });
}

/**
 *  API
 */
exports.send = Q.denodeify(send);
