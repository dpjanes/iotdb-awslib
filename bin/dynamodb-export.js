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
const minimist = require('minimist');

const aws = require("../index");
const aws$cfg = {
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

aws$cfg.region = ad.region || aws$cfg.region;

_.promise.make({
    aws$cfg: aws$cfg,
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
    .then(fs.mkdir.parent)
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
