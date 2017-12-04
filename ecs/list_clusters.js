/**
 *  ecs/list_clusters.js
 *
 *  David Janes
 *  IOTDB
 *  2017-12-04
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

/**
 *  Requires: self.ecs, 
 *  Produces: self.aws_result, self.clusters
 */
const list_clusters = _.promise.done((self, done) => {
    const method = "ecs.list_clusters";

    assert.ok(self.ecs, `${method}: self.ecs is required`);

    self.ecs.listClusters((error, data) => {
        if (error) {
            return done(error);
        }

        assert.ok(data)
        assert.ok(data.clusterArns)

        self.aws_result = data;
        self.clusters = data.clusterArns;

        done(null, self);
    });
})

/**
 *  API
 */
exports.list_clusters = list_clusters;
