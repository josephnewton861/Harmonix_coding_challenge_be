"use strict";
const AWS = require("aws-sdk");
const crypto = require("crypto");
const documentClient = new AWS.DynamoDB.DocumentClient();
const generateUUID = () => crypto.randomBytes(16).toString("hex");

exports.handler = async (event, context) => {
  let responseBody = "";
  let statusCode = 0;

  const {
    id,
    anagramInput1,
    anagramInput2,
    timestamp,
    trueOrFalseAnagram,
  } = JSON.parse(event["body"]);

  const params = {
    TableName: "harmonix",
    Item: {
      id: generateUUID(),
      anagramInput1: anagramInput1,
      anagramInput2: anagramInput2,
      timestamp: timestamp,
      trueOrFalseAnagram: trueOrFalseAnagram,
    },
  };

  try {
    const data = await documentClient.put(params).promise();
    responseBody = JSON.stringify(data);
    statusCode = 201;
  } catch (err) {
    responseBody = `Unable to put product: ${err}`;
    statusCode = 500;
  }

  const response = {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, PO",
    },
    body: responseBody,
  };

  return response;
};
