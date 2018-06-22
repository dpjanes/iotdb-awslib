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
    require("./list_repositories"),
    require("./repository_get_by_name"),
    require("./create_repository"),
    require("./delete_repository"),
    {}
);

module.exports.repository = {
    create: module.exports.create_repository,
    delete: module.exports.delete_repository,
    list: module.exports.list_repositories,
    get_by_name: module.exports.repository_get_by_name,
}

