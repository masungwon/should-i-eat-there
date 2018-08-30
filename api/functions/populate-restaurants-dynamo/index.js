const fs = require("fs");
const AWS = require("aws-sdk");
const _ = require("lodash");
const fetch = require("node-fetch");

const dynamo = new AWS.DynamoDB.DocumentClient({
  region: "us-east-1",
  convertEmptyValues: true
});

const utils = require("./utils");

const TABLE_NAME = "restaurants";
const LIMIT = 500000;
// const SOURCE_FILE = "./restaurants.json";

exports.handler = async event => {
  try {
    const data = await fetchData();
    console.log("data.length: ", data.length);
    const restaurants = data.map(item => {
      const created_at = utils.currentDate().toISOString();
      return {
        ...item,
        id: utils.getRandomUUID(),
        created_at,
        updated_at: created_at
      };
    });
    return insertRecords(restaurants)
      .then(() => {
        console.log(`finished inserting ${restaurants.length} items to dynamo`);
      })
      .catch(error => {
        console.log("error:\n", error);
      });
  } catch (e) {
    console.log("an unexpected error occurred", e);
  }
};

async function fetchData() {
  try {
    const response = await fetch(
      `https://data.cityofnewyork.us/resource/9w7m-hzhe.json?$limit=${LIMIT}`,
      {
        method: "GET",
        body: null,
        headers: {
          Accept: "application/json",
          "X-App-Token": "Os4KRspOoCdpoyfWn72pfgJYd"
        }
      }
    );
    if (response.status === 200) {
      const json = response.json();
      console.log("successfully fetched data!");
      return json;
    } else {
      throw new Error("Something went wrong on api server!");
    }
  } catch (error) {
    console.error(error);
  }
}
// // start here
// fs.readFile(SOURCE_FILE, "utf8", function(err, data) {
//   if (err) {
//     console.log(err);
//   } else {
//     const items = JSON.parse(data).map(item => {
//       const created_at = utils.currentDate().toISOString();
//       return {
//         ...item,
//         id: item.camis,
//         created_at,
//         updated_at: created_at
//       };
//     });
//     insertRecords(items).catch(error => {
//       console.log("error:\n", error);
//     });
//   }
// });

const baseBackOffTime = 100;
const backOffFactor = 2;
let backOffTime = baseBackOffTime;

const batchSize = 25;

function insertRecords(records) {
  let unprocessed = [];
  return _
    .chunk(records, batchSize)
    .reduce((promise, chunk) => {
      return promise.then(() => {
        return new Promise((resolve, reject) => {
          const batchParams = processChunk(chunk);

          dynamo.batchWrite(batchParams, (error, result) => {
            if (error) {
              console.log("batchParams:\n", JSON.stringify(batchParams));
              return reject(error);
            }
            // if (result) console.log("result:\n", result);
            if (result.UnprocessedItems[TABLE_NAME]) {
              backOffTime *= backOffFactor;
              unprocessed = unprocessed.concat(
                result.UnprocessedItems[TABLE_NAME].map(
                  item => item.PutRequest.Item
                )
              );
            } else {
              backOffTime = baseBackOffTime;
            }
            // console.log(`Waiting ${backOffTime / 1000} seconds.`);
            return setTimeout(resolve, backOffTime);
          });
        });
      });
    }, Promise.resolve())
    .then(() => {
      if (!unprocessed.length) return Promise.resolve();
      //   console.log("Restarting with unprocessed records");
      return insertRecords(unprocessed);
    });
}

const processChunk = function(arr) {
  let batchParams = {
    RequestItems: {}
  };
  batchParams.RequestItems[TABLE_NAME] = [];
  arr.forEach(item => {
    sanitizeObject(item);
    batchParams.RequestItems[TABLE_NAME].push({
      PutRequest: {
        Item: item
      }
    });
  });
  return batchParams;
};

function sanitizeObject(obj) {
  for (var i in obj) {
    if (obj[i] === null || obj[i] === "") {
      delete obj[i];
    } else if (typeof obj[i] === "object") {
      sanitizeObject(obj[i]);
    }
  }
}

exports.handler();
