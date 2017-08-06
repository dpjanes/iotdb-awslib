#!/usr/bin/env node
/**
 *  dynamodb-export.js
 *
 *  David Janes
 *  IOTDB
 *  2017-06-28
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");
const fs = require("iotdb-fs");

const assert = require("assert");
const path = require("path");

const AWS = require("aws-sdk");
const Q = require("bluebird-q");
const minimist = require('minimist');

const aws = require("../index");
const awsd = {
    region:'us-east-1',

    // profile: "consensas",
}

const ad = minimist(process.argv.slice(2), {
    binary: [],
});

if (ad._.length < 1) {
    console.log("usage: dynamodb-get [--region <region>] <table-name>")
    process.exit(1)
}

const table_name = ad._[0]

awsd.region = ad.region || awsd.region;

Q({
    awsd: awsd,
    table_name: table_name,
    result: {
        table_name: table_name,
        schema: {},
        items: [],
    }
})
    .then(aws.initialize)
    .then(aws.dynamodb.initialize)
    .then(aws.dynamodb.describe_table)
    .then(sd => {
        sd.result.schema.keys = sd.table.KeySchema.map(kd => kd.AttributeName)
        sd.result.schema.indexes = {};

        (sd.table.GlobalSecondaryIndexes || []).forEach(xd => {
            sd.result.schema.indexes[xd.IndexName] = xd.KeySchema.map(kd => kd.AttributeName)
        })

        return sd;
    })
    .then(aws.dynamodb.all)
    .then(sd => {
        sd.result.items = sd.jsons;

        sd.path = `exported/${table_name}.json`;
        sd.json = sd.result;

        return sd;
    })
    .then(fs.write.mkdir.parent)
    .then(fs.write.json)
    .then(sd => {
        console.log("+", "#items", sd.result.items.length)
        console.log("+", "keys", sd.result.schema.keys)
        console.log("+", "indexes", _.keys(sd.result.schema.indexes).sort())
    })
    .catch(error => {
        console.log("ERROR", error)
        console.log("#", _.error.message(error))
    })

    /*

    .then(_sd => {
        const sd = _.d.clone.shallow(_sd)
        sd.query = {
            [ _sd.table.KeySchema[0].AttributeName ]: primary_key,
        }

        // console.log(JSON.stringify(_sd.table, null, 2))
        return sd;
    })
    .then(aws.dynamodb.get)
    .then(_sd => {
        const sd = _.d.clone.shallow(_sd)
        console.log(JSON.stringify(sd.json, null, 2))
        return sd;
    })
    .catch(error => {
        console.log("ERROR", error)
        console.log("#", _.error.message(error))
    })
    */
