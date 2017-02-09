/**
 *  test_dynamodb.js
 *
 *  David Janes
 *  IOTDB
 *  2017-01-29
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const AWS = require("aws-sdk");
const Q = require("q");
const minimist = require('minimist');

const aws = require("../index");
const awsd = {
    profile: "consensas",
    region: "us-east-1",
}

const ad = minimist(process.argv.slice(2));

const action = (name) => ad._.indexOf(name) > -1;

if (action("initialize")) {
    Q({
        aws: awsd,
    })
        .then(aws.initialize)
        .then(aws.dynamodb.initialize)
        .then(_self => console.log("+", "ok"))
        .catch(error => console.log("#", _.error.message(error)))
}

if (action("create-table")) {
    Q({
        aws: awsd,
        table_name: "movies",
        partition_key: "#year",
        sort_key: "title",
        write_capacity_units: 10,
    })
        .then(aws.initialize)
        .then(aws.dynamodb.initialize)
        .then(aws.dynamodb.create_table)
        .then(_self => console.log("+", "ok"))
        .catch(error => console.log("#", _.error.message(error)))
}

if (action("create-table-wait")) {
    Q({
        aws: awsd,
        table_name: "movies",
        partition_key: "#year",
        sort_key: "title",
        write_capacity_units: 10,
    })
        .then(aws.initialize)
        .then(aws.dynamodb.initialize)
        .then(aws.dynamodb.create_table)
        .then(aws.dynamodb.wait_table_exists)
        .then(_self => console.log("+", "ok"))
        .catch(error => console.log("#", _.error.message(error)))
}

if (action("delete-table")) {
    Q({
        aws: awsd,
        table_name: "movies",
    })
        .then(aws.initialize)
        .then(aws.dynamodb.initialize)
        .then(aws.dynamodb.delete_table)
        .then(_self => console.log("+", "ok"))
        .catch(error => console.log("#", _.error.message(error)))
}

if (action("put")) {
    Q({
        aws: awsd,
        table_name: "movies",
        json: {
            year: 1999,
            title: "The Matrix",
            info: "choose the red or the blue pill",
        },
    })
        .then(aws.initialize)
        .then(aws.dynamodb.initialize)
        .then(aws.dynamodb.put)
        .then(_self => console.log("+", "ok"))
        .catch(error => console.log("#", _.error.message(error)))
}


if (action("get")) {
    Q({
        aws: awsd,
        table_name: "movies",
        query: {
            year: 1999,
            title: "The Matrix",
        },
    })
        .then(aws.initialize)
        .then(aws.dynamodb.initialize)
        .then(aws.dynamodb.get)
        .then(_self => console.log("+", "ok", _self.json))
        .catch(error => console.log("#", _.error.message(error)))
}

if (action("query-simple")) {
    Q({
        aws: awsd,
        table_name: "movies",
        query: {
            year: 1999,
            title: "The Matrix",
        },
    })
        .then(aws.initialize)
        .then(aws.dynamodb.initialize)
        .then(aws.dynamodb.query_simple)
        .then(_self => console.log("+", "ok", _self.jsons))
        .catch(error => console.log("#", _.error.message(error)))
}

if (action("scan-simple")) {
    Q({
        aws: awsd,
        table_name: "movies",
        query: {
            title: "The Matrix",
        },
        keys: [ "title", "#year" ],
    })
        .then(aws.initialize)
        .then(aws.dynamodb.initialize)
        .then(aws.dynamodb.scan_simple)
        .then(_self => console.log("+", "ok", _self.jsons))
        .catch(error => console.log("#", _.error.message(error)))
}

