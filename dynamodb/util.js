/**
 *  dynamodb/create_table.js
 *
 *  David Janes
 *  IOTDB
 *  2017-02-09
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const key_name = key => key.replace(/^[#!]/, "")
const key_type = key => {
    if (key.match(/^#/)) {
        return "N";
    } else if (key.match(/^!/)) {
        return "B";
    } else {
        return "S";
    }
}


/**
 *  API
 */
exports.key_name = key_name;
exports.key_type = key_type;
