"use strict";

const { flatten } = require("lodash");
const AWS = require("aws-sdk");

const {
  DynamoDB: { Converter }
} = AWS;
const elasticsearch = require("elasticsearch");
const { VError } = require("verror");

// const logger = require("../../shared/services/logger");

const {
  ESENDPOINTURL,
  ES_INDEX,
  ES_TYPE,
  ES_ID = "id",
  ACCESS_KEY_ID,
  SECRET_ACCESS_KEY
} = process.env;

AWS.config.update({
  credentials: new AWS.Credentials(ACCESS_KEY_ID, SECRET_ACCESS_KEY),
  region: "us-east-1"
});

const client = new elasticsearch.Client({
  host: ESENDPOINTURL,
  connectionClass: require("http-aws-es")
});

const ElasticsearchResponseError = (cause, info) => {
  const name = "ElasticsearchResponseError";
  const message = "Failed to execute operations on Elasticsearch index";
  return new VError({ name, cause, info }, message);
};

exports.handler = async (event, context, callback) => {
  try {
    const operations = event.Records.map(record => ({
      eventName: record.eventName,
      body: Converter.unmarshall(
        record.dynamodb.NewImage || record.dynamodb.OldImage
      )
    })).map(record => {
      if (record.eventName === "REMOVE") {
        return {
          delete: {
            _index: ES_INDEX,
            _type: ES_TYPE,
            _id: record.body[ES_ID]
          }
        };
      }
      return [
        {
          index: {
            _index: ES_INDEX,
            _type: ES_TYPE,
            _id: record.body[ES_ID]
          }
        },
        record.body
      ];
    });

    const response = await client.bulk({
      body: flatten(operations)
    });

    if (response.errors) {
      throw ElasticsearchResponseError(null, { response });
    }

    return callback(null, "Success");
  } catch (err) {
    // logger.error({ err, event });
    console.log(JSON.stringify({ err, event }, null, 2));
    return callback(null, "Failed to update records");
  }
};
