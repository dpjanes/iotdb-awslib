/**
 *  samples/route53.js
 *
 *  David Janes
 *  IOTDB
 *  2018-03-08
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict"

const _ = require("iotdb-helpers")

const assert = require("assert")

const AWS = require("aws-sdk")
const minimist = require('minimist')

const aws = require("../index")
const config = require("./aws.json")
const aws$cfg = config.aws$cfg

const _normalize = s => s.replace(/-/g, "_")
const ad = minimist(process.argv.slice(2));
ad._ = ad._.map(_normalize)

const action = name => ad._.indexOf(_normalize(name)) > -1;

if (action("initialize")) {
    _.promise.make({
        aws$cfg: aws$cfg,
    })
        .then(aws.initialize)
        .then(aws.route53.initialize)
        .then(_.promise.make(sd => {
            console.log("+", "ok")
        }))
        .catch(error => {
            console.log("#", _.error.message(error))
        })
}

if (action("list_zones")) {
    _.promise.make({
        aws$cfg: aws$cfg,
    })
        .then(aws.initialize)
        .then(aws.route53.initialize)
        .then(aws.route53.list_zones)
        .then(_.promise.make(sd => {
            console.log("+", "ok", JSON.stringify(sd.zones, null, 2))
        }))
        .catch(error => {
            console.log("#", _.error.message(error))
        })
}

if (action("find_zone")) {
    _.promise.make({
        aws$cfg: aws$cfg,
        zone_name: "consensas.internal.",
        zone_private: null,
    })
        .then(aws.initialize)
        .then(aws.route53.initialize)
        .then(aws.route53.list_zones)
        .then(aws.route53.find_zone)
        .then(_.promise.make(sd => {
            console.log("+", "ok", JSON.stringify(sd.zone, null, 2))
        }))
        .catch(error => {
            console.log("#", _.error.message(error))
        })
}

if (action("list_resources")) {
    _.promise.make({
        aws$cfg: aws$cfg,
        zone_name: "consensas.internal.",
        zone_private: null,
        resource_name: "cloud.consensas.internal.",
    })
        .then(aws.initialize)
        .then(aws.route53.initialize)
        .then(aws.route53.list_zones)
        .then(aws.route53.find_zone)
        .then(aws.route53.list_resources)
        .then(_.promise.make(sd => {
            console.log("+", "ok", JSON.stringify(sd.resources, null, 2))
        }))
        .catch(error => {
            console.log("#", _.error.message(error))
        })
}

if (action("find_resource")) {
    _.promise.make({
        aws$cfg: aws$cfg,
        zone_name: "consensas.internal.",
        zone_private: null,
        resource_name: "cloud.consensas.internal.",
    })
        .then(aws.initialize)
        .then(aws.route53.initialize)
        .then(aws.route53.list_zones)
        .then(aws.route53.find_zone)
        .then(aws.route53.list_resources)
        .then(aws.route53.find_resource)
        .then(_.promise.make(sd => {
            console.log("+", "ok", JSON.stringify(sd.resource, null, 2))
        }))
        .catch(error => {
            console.log("#", _.error.message(error))
        })
}


if (action("create.a")) {
    _.promise.make({
        aws$cfg: aws$cfg,
        zone_name: "consensas.internal.",
        zone_private: null,
    })
        .then(aws.initialize)
        .then(aws.route53.initialize)
        .then(aws.route53.list_zones)
        .then(aws.route53.find_zone)
        .then(aws.route53.resource.A("localhost.consensas.internal", "127.0.0.1"))
        .then(aws.route53.resource.create)
        .then(_.promise.make(sd => {
            console.log("+", "ok", JSON.stringify(sd.resource, null, 2))
        }))
        .catch(error => {
            console.log("#", _.error.message(error))
            delete error.self
            console.log(error)
        })
}

if (action("upsert.a")) {
    _.promise.make({
        aws$cfg: aws$cfg,
        zone_name: "consensas.internal.",
        zone_private: null,
    })
        .then(aws.initialize)
        .then(aws.route53.initialize)
        .then(aws.route53.list_zones)
        .then(aws.route53.find_zone)
        .then(aws.route53.resource.A("localhost.consensas.internal", "127.0.0.1"))
        .then(aws.route53.resource.upsert)
        .then(_.promise.make(sd => {
            console.log("+", "ok", JSON.stringify(sd.resource, null, 2))
        }))
        .catch(error => {
            console.log("#", _.error.message(error))
            delete error.self
            console.log(error)
        })
}

if (action("delete.a")) {
    _.promise.make({
        aws$cfg: aws$cfg,
        zone_name: "consensas.internal.",
        zone_private: null,
    })
        .then(aws.initialize)
        .then(aws.route53.initialize)
        .then(aws.route53.list_zones)
        .then(aws.route53.find_zone)
        .then(aws.route53.resource.A("localhost.consensas.internal", "127.0.0.1"))
        .then(aws.route53.resource.delete)
        .then(_.promise.make(sd => {
            console.log("+", "ok", JSON.stringify(sd.resource, null, 2))
        }))
        .catch(error => {
            console.log("#", _.error.message(error))
            delete error.self
            console.log(error)
        })
}

