#!/usr/bin/env node
/**
 *  dynamodb-get.js
 *
 *  David Janes
 *  IOTDB
 *  2017-06-28
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");
const path = require("path");
const fs = require("fs");

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

if (ad._.length < 2) {
    console.log("usage: dynamodb-get [--region <region>] <table-name> <primary-key>")
    process.exit(1)
}

const table_name = ad._[0]
const primary_key = ad._[1]

aws$cfg.region = ad.region || aws$cfg.region;

_.promise.make({
    aws$cfg: aws$cfg,
    table_name: table_name,
})
    .then(aws.initialize)
    .then(aws.dynamodb.initialize)
    .then(aws.dynamodb.describe_table)
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
