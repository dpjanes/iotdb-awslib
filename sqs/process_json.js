/**
 *  sqs/process_json.js
 *
 *  David Janes
 *  IOTDB
 *  2017-01-30
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const AWS = require("aws-sdk");
const Q = require("bluebird-q");

/**
 *  Accepts: 
 *  Produces:
 */
const process_json = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "sqs.process_json";

    const receive_message = require("./receive_message").receive_message;
    const receive_json = require("./receive_json").receive_json;
    const delete_message = require("./delete_message").delete_message;

    assert.ok(self.sqs, `${method}: self.sqs is required`);
    assert.ok(_.is.String(self.queue_url), `${method}: self.queue_url must be a String`);

    assert.ok(_.is.Function(self.handle_error) || !self.handle_error, `${method}: self.handle_error must be a Function or Null`);
    assert.ok(_.is.Function(self.handle_failure) || !self.handle_failure, `${method}: self.handle_failure must be a Function or Null`);
    assert.ok(_.is.Function(self.handle_message), `${method}: self.handle_message must be a Function`);

    self.handle_error = self.handle_error || _.noop;
    self.handle_failure = self.handle_failure || _.noop;
    self.message = null;

    done(null, self);

    const _do_one = () => {
        Q(self)
            .then(receive_json)
            .then(message_self => {
                Q(message_self)
                    .then(self.handle_message)
                    .catch(self.handle_error)
                    .done(() => {
                        Q(message_self)
                            .then(delete_message);

                        process.nextTick(_do_one)
                    })
                        
            })
            .catch(self.handle_failure)
    }

    _do_one();
}

/**
 *  API
 */
exports.process_json = Q.denodeify(process_json);
