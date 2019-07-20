/**
 *  s3/parse_path.js
 *
 *  David Janes
 *  IOTDB
 *  2017-01-18
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict"

const _ = require("iotdb-helpers")

const assert = require("assert")
const url = require("url")

/**
 *  Accepts: 
 *  Produces:
 */
const parse_path = _.promise(self => {
    _.promise.validate(self, parse_path)

    const urlp = url.parse(self.path)
    switch (urlp.protocol) {
    case "s3:":
        assert.ok(urlp.hostname.indexOf('.') === -1, `${parse_path.method}: self.path: AWS regions not supported yet`)

        self.key = (urlp.pathname || "").replace(/^\//, '')
        self.bucket = urlp.hostname
        break

    case "https:":
        const match = urlp.hostname.match(/^([^.]*)[.]s3[.]amazonaws[.]com$/)
        if (!match) {
            assert.ok(false, `${parse_path.method}: don't recognize ${urlp.protocol}//${urlp.hostname}`)
        }

        self.key = (urlp.pathname || "").replace(/^\//, '')
        self.bucket = match[1]
        break

    default:
        assert.ok(false, `${parse_path.method}: bad protocol=${urlp.protocol}`)
    }

})

parse_path.method = "s3.parse_path"
parse_path.requires = {
    path: _.is.String,
}
parse_path.accepts = {
}
parse_path.produces = {
    key: _.is.String,
    bucket: _.is.String,
}

/**
 *  API
 */
exports.parse_path = parse_path
