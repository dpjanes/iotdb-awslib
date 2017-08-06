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
const Q = require("bluebird-q");
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
        awsd: awsd,
    })
        .then(aws.initialize)
        .then(aws.dynamodb.initialize)
        .then(sd => console.log("+", "ok"))
        .catch(error => console.log("#", _.error.message(error)))
}

if (action("create-table")) {
    Q({
        awsd: awsd,
        table_name: "movies",
        partition_key: "#year",
        sort_key: "title",
        write_capacity_units: 10,
    })
        .then(aws.initialize)
        .then(aws.dynamodb.initialize)
        .then(aws.dynamodb.create_table)
        .then(sd => console.log("+", "ok"))
        .catch(error => console.log("#", _.error.message(error)))
}

if (action("create-table-wait")) {
    Q({
        awsd: awsd,
        table_name: "movies",
        partition_key: "#year",
        sort_key: "title",
        write_capacity_units: 10,
    })
        .then(aws.initialize)
        .then(aws.dynamodb.initialize)
        .then(aws.dynamodb.create_table)
        .then(aws.dynamodb.wait_table_exists)
        .then(sd => console.log("+", "ok"))
        .catch(error => console.log("#", _.error.message(error)))
}

if (action("delete-table")) {
    Q({
        awsd: awsd,
        table_name: "movies",
    })
        .then(aws.initialize)
        .then(aws.dynamodb.initialize)
        .then(aws.dynamodb.delete_table)
        .then(sd => console.log("+", "ok"))
        .catch(error => console.log("#", _.error.message(error)))
}

if (action("put")) {
    Q({
        awsd: awsd,
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
        .then(sd => console.log("+", "ok"))
        .catch(error => console.log("#", _.error.message(error)))
}

if (action("replace-fail")) {
    Q({
        awsd: awsd,
        table_name: "movies",
        query: {
            year: 1999,
            title: _.timestamp.make(),
        },
        json: {
            year: 1999,
            title: "The Matrix 3D",
        },
    })
        .then(aws.initialize)
        .then(aws.dynamodb.initialize)
        .then(aws.dynamodb.replace)
        .then(sd => console.log("+", "ok"))
        .catch(error => console.log("#", _.error.message(error)))
}


if (action("get")) {
    Q({
        awsd: awsd,
        table_name: "movies",
        query: {
            year: 1999,
            title: "The Matrix",
        },
    })
        .then(aws.initialize)
        .then(aws.dynamodb.initialize)
        .then(aws.dynamodb.get)
        .then(sd => console.log("+", "ok", sd.json))
        .catch(error => console.log("#", _.error.message(error)))
}

if (action("query-simple")) {
    Q({
        awsd: awsd,
        table_name: "movies",
        query: {
            year: 1999,
            title: "The Matrix",
        },
    })
        .then(aws.initialize)
        .then(aws.dynamodb.initialize)
        .then(aws.dynamodb.query_simple)
        .then(sd => console.log("+", "ok", sd.jsons))
        .catch(error => console.log("#", _.error.message(error)))
}

if (action("scan-simple")) {
    Q({
        awsd: awsd,
        table_name: "movies",
        query: {
            title: "The Matrix",
        },
        keys: [ "title", "#year" ],
    })
        .then(aws.initialize)
        .then(aws.dynamodb.initialize)
        .then(aws.dynamodb.scan_simple)
        .then(sd => console.log("+", "ok", sd.jsons))
        .catch(error => console.log("#", _.error.message(error)))
}

if (action("page-all")) {
    const _run = pager => {
        Q({
            awsd: awsd,
            table_name: "ledger",
            query_limit: 5,
            pager: pager,
        })
            .then(aws.initialize)
            .then(aws.dynamodb.initialize)
            .then(aws.dynamodb.all)
            .then(sd => {
                console.log("+", "ok", JSON.stringify(sd.jsons.map(l => l.ledger_id), null, 2))
                // console.log("+", "ok", JSON.stringify(sd.jsons.map(l => l.user_id), null, 2))
                console.log("+", "pager", sd.pager)
                // console.log("+", "pager", _.id.unpack(sd.pager))
                
                if (sd.pager) {
                    process.nextTick(() => {
                        _run(sd.pager)
                    })
                }
            })
            .catch(error => console.log("#", _.error.message(error)))
    }

    _run()
}

if (action("page-scan")) {
    const _run = pager => {
        Q({
            awsd: awsd,
            table_name: "ledger",
            query_limit: 5,
            pager: pager,
            query: {
                "user_id": "urn:consensas:user:Q-SVYoHm7E",
            }
        })
            .then(aws.initialize)
            .then(aws.dynamodb.initialize)
            .then(aws.dynamodb.scan_simple)
            .then(sd => {
                console.log("+", "ok", JSON.stringify(sd.jsons.map(l => l.ledger_id), null, 2))
                console.log("+", "pager", sd.pager)
                // console.log("+", "pager", _.id.unpack(sd.pager))
                
                if (sd.pager) {
                    process.nextTick(() => {
                        _run(sd.pager)
                    })
                }
            })
            .catch(error => console.log("#", _.error.message(error)))
    }

    _run()
}


if (action("page-query")) {
    const _run = pager => {
        Q({
            awsd: awsd,
            table_name: "snapshot",
            index_name: "user_id-created-index",
            query_limit: 5,
            pager: pager,
            query: {
                "user_id": "urn:consensas:user:Q-SVYoHm7E",
            }
        })
            .then(aws.initialize)
            .then(aws.dynamodb.initialize)
            .then(aws.dynamodb.query_simple)
            .then(sd => {
                console.log("+", "ok", JSON.stringify(sd.jsons.map(l => l.ledger_id), null, 2))
                console.log("+", "pager", sd.pager)
                // console.log("+", "pager", _.id.unpack(sd.pager))
                
                if (sd.pager) {
                    process.nextTick(() => {
                        _run(sd.pager)
                    })
                }
            })
            .catch(error => console.log("#", _.error.message(error)))
    }

    _run()
}

