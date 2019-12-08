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
const fs = require("iotdb-fs");
const zip = require("iotdb-zip");

const assert = require("assert");

const minimist = require('minimist');

const aws = require("../index");
const config = require("./aws.json")
const aws$cfg = config.aws$cfg

const ad = minimist(process.argv.slice(2));

let action = (name) => ad._.indexOf(name) > -1;

if (ad.help) {
    console.log("usage:", process.argv[1], "<command>")
    action = name => {
        console.log(" ", name)
        return 0;
    }
}

if (action("initialize")) {
    _.promise.make({
        aws$cfg: aws$cfg,
    })
        .then(aws.initialize)
        .then(aws.dynamodb.initialize)
        .then(sd => console.log("+", "ok"))
        .catch(error => console.log("#", _.error.message(error)))
}

if (action("create-table")) {
    _.promise.make({
        aws$cfg: aws$cfg,
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

if (action("load-table")) {
    _.promise.make({
        aws$cfg: aws$cfg,
        table_name: "movies",
    })
        .then(aws.initialize)
        .then(aws.dynamodb.initialize)
        .then(zip.initialize.open.p("./data/moviedata.zip"))
        .then(zip.read.json.p("moviedata.json"))
        .then(_.promise.block(sd => {
            sd.movies = sd.json.filter(movie => movie.year >= 1999 && movie.year <= 2001);
        }))
        .then(_.promise.series({
            method: aws.dynamodb.put,
            inputs: "movies:json",
        }))
        .then(sd => console.log("+", "ok"))
        .catch(error => console.log("#", _.error.message(error)))
}

if (action("create-table-wait")) {
    _.promise.make({
        aws$cfg: aws$cfg,
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
    _.promise.make({
        aws$cfg: aws$cfg,
        table_name: "movies",
    })
        .then(aws.initialize)
        .then(aws.dynamodb.initialize)
        .then(aws.dynamodb.delete_table)
        .then(sd => console.log("+", "ok"))
        .catch(error => console.log("#", _.error.message(error)))
}

if (action("put")) {
    _.promise.make({
        aws$cfg: aws$cfg,
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
    _.promise.make({
        aws$cfg: aws$cfg,
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
    _.promise.make({
        aws$cfg: aws$cfg,
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
    _.promise.make({
        aws$cfg: aws$cfg,
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

/**
 *  THIS IS NOT WORKING YET
 */
if (action("query-range")) {
    _.promise.make({
        aws$cfg: aws$cfg,
        table_name: "movies",
        query: {
            year: [ "!=", 1999, ],
            title: "The Matrix", // [ "between", "A", "Z", ]
        },
    })
        .then(aws.initialize)
        .then(aws.dynamodb.initialize)
        .then(aws.dynamodb.query_simple)
        .then(sd => console.log("+", "ok", sd.jsons))
        .catch(error => console.log("#", _.error.message(error)))
}

if (action("scan-simple")) {
    _.promise.make({
        aws$cfg: aws$cfg,
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
        _.promise.make({
            aws$cfg: aws$cfg,
            table_name: "movies",
            query_limit: 5,
            pager: pager,
        })
            .then(aws.initialize)
            .then(aws.dynamodb.initialize)
            .then(aws.dynamodb.all)
            .then(sd => {
                console.log("+", "ok", JSON.stringify(sd.jsons.map(l => l.title), null, 2))
                // console.log("+", "ok", JSON.stringify(sd.jsons.map(l => l.user_id), null, 2))
                console.log("+", "pager", sd.pager)
                // console.log("+", "pager", _.id.unpack(sd.pager))
                
                if (sd.cursor && sd.cursor.next) {
                    process.nextTick(() => {
                        _run(sd.cursor.next)
                    })
                }
            })
            .catch(error => console.log("#", _.error.message(error)))
    }

    _run()
}

if (action("page-scan")) {
    const _run = pager => {
        _.promise.make({
            aws$cfg: aws$cfg,
            table_name: "movies",
            query_limit: 5,
            pager: pager,
            query: {
                "year": 1999,
            },
        })
            .then(aws.initialize)
            .then(aws.dynamodb.initialize)
            .then(aws.dynamodb.scan_simple)
            .then(sd => {
                console.log("+", "ok", JSON.stringify(sd.jsons.map(l => l.title), null, 2))
                console.log("+", "pager", sd.pager)
                // console.log("+", "pager", _.id.unpack(sd.pager))
                
                if (sd.cursor && sd.cursor.next) {
                    process.nextTick(() => {
                        _run(sd.cursor.next)
                    })
                }
            })
            .catch(error => console.log("#", _.error.message(error)))
    }

    _run()
}

if (action("page-query")) {
    const _run = pager => {
        _.promise.make({
            aws$cfg: aws$cfg,
            table_name: "movies",
            query_limit: 5,
            pager: pager,
            query: {
                "year": 1999,
            },
        })
            .then(aws.initialize)
            .then(aws.dynamodb.initialize)
            .then(aws.dynamodb.query_simple)
            .then(sd => {
                console.log("+", "ok", JSON.stringify(sd.jsons.map(l => l.title), null, 2))
                console.log("+", "pager", sd.pager)
                
                if (sd.cursor && sd.cursor.next) {
                    process.nextTick(() => {
                        _run(sd.cursor.next)
                    })
                }
            })
            .catch(error => console.log("#", _.error.message(error)))
    }

    _run()
}

if (action("promise-page-query")) {
    _.promise.make({
        aws$cfg: aws$cfg,
        table_name: "movies",
        query_limit: 5,
        query: {
            "year": 1999,
        },
    })
        .then(aws.initialize)
        .then(aws.dynamodb.initialize)
        .then(_.promise.page({
            batch: aws.dynamodb.query_simple,
            method: sd => console.log("title", sd.json.title),
        }))
        .then(sd => console.log("+", "ok"))
        .catch(error => {
            console.log("#", _.error.message(error))
            console.log(error);
        })
}

