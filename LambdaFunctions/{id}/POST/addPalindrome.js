"use strict";
const AWS = require("aws-sdk");
const crypto = require("crypto");
const documentClient = new AWS.DynamoDB.DocumentClient();
const generateUUID = () => crypto.randomBytes(16).toString("hex");

exports.handler = async (event, context) => {
  let responseBody = "";
  let statusCode = 0;

  const { id, palindromeInput, timestamp, trueOrFalse } = JSON.parse(
    event["body"]
  );

  const params = {
    TableName: "harmonix",
    Item: {
      id: generateUUID(),
      palindromeInput: palindromeInput,
      timestamp: timestamp,
      trueOrFalse: trueOrFalse,
    },
  };

  try {
    const data = await documentClient.put(params).promise();
    responseBody = JSON.stringify(data);
    statusCode = 201;
  } catch (err) {
    responseBody = `Unable to put product: ${err}`;
    statusCode = 403;
  }

  const response = {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST",
    },
    body: responseBody,
  };

  return response;
};
