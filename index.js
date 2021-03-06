/*
 *  index.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-01-18
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict"

exports.initialize = require("./initialize").initialize

exports.dynamodb = require("./dynamodb")
exports.ecs = require("./ecs")
exports.kinesis = require("./kinesis")
exports.lambda = require("./lambda")
exports.s3 = require("./s3")
exports.s3.fs = require("./s3/fs")
exports.ses = require("./ses")
exports.sns = require("./sns")
exports.sqs = require("./sqs")
exports.cloudwatch = require("./cloudwatch")
exports.route53 = require("./route53")
exports.ec2 = require("./ec2")
exports.ecr = require("./ecr")
exports.translate = require("./translate")
exports.comprehend = require("./comprehend")
exports.transcribe = require("./transcribe")
