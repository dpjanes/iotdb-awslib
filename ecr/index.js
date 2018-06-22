/*
 *  ecr/index.js
 *
 *  David Janes
 *  IOTDB
 *  2018-06-22
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict"

module.exports = Object.assign(
    {},
    require("./initialize"),
    require("./describe_repositories"),
    {}
);

module.exports.repository = {
    list: module.exports.describe_repositories,
    get_by_name: _.promise.make((self, done
}

