#!/usr/bin/env node
/**
 *  cloudwatch-watch.js
 *
 *  David Janes
 *  IOTDB
 *  2017-12-15
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");
const path = require("path");

const minimist = require('minimist');

const aws = require("../index");
const awsd = {
    region:'us-east-1',
}

const ad = minimist(process.argv.slice(2), {
});

if (ad._.length !== 1) {
    console.log("usage: cloudwatch <log-group>")
    process.exit(1);
}

const state = {}

/**
 *  Pulls one log
 */
const _pull = _.promise.make((self, done) => {
    _.promise.make(self)
        .then(_.promise.add("log_stream", self.log_stream_description.logStreamName))
        .then(aws.cloudwatch.get_jsons.after(self.log_stream_description.lastEventTimestamp))
        .then(_.promise.make(sd => {
            sd.jsons.forEach(json => console.log(json))
        }))
        .then(_.promise.done(done, self))
        .catch(done)
    
})

/**
 *  This will see if any of the log groups have changed
 */
const _check = _.promise.make((self, done) => {
    _.promise.make(self)
        .then(aws.cloudwatch.describe_log_streams)
        .then(_.promise.make(sd => {
            sd.log_stream_descriptions = sd.log_stream_descriptions
                .filter(lsd => {
                    const previous = state[lsd.logStreamName];
                    if (!previous) {
                        return lsd
                    } else if (previous.lastEventTimestamp !== lsd.lastEventTimestamp) {
                        return lsd
                    }
                })

            sd.log_stream_descriptions.forEach(lsd => {
                state[lsd.logStreamName] = lsd
            })

            // console.log("===")
            // console.log(sd.log_stream_descriptions)

        }))
        .then(_.promise.series({
            method: _pull,
            inputs: "log_stream_descriptions:log_stream_description",
        }))
        .then(_.promise.done(done, self))
        .catch(error => {
            console.log("#", _.error.message(error))
            done(null, self)
        })
})

/**
 *  This will call "_check" forever every 15 seconds
 */
const _repeat = self => {
    _.promise.make(self)
        .then(_check)
        .then(_.promise.make(sd => {
            setTimeout(() => _repeat(self), 15 * 1000)
        }))
}

/**
 */
const monitor_log_group = log_group => {
    _.promise.make({
        awsd: awsd,
        log_group: ad._[0],
    })
        .then(aws.initialize)
        .then(aws.cloudwatch.initialize)
        .then(_.promise.make(sd => {
            _repeat(sd)
        }))
        .catch(error => {
            console.log("#", _.error.message(error))
        })
}

monitor_log_group(ad._[0])
