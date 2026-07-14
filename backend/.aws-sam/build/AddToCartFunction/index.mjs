import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    const claims = event.requestContext.authorizer.jwt.claims;
    const userId = claims.sub;

    // Get path parameters
    const { productId } = event.pathParameters;

    // Get body
    const body = JSON.parse(event.body);
    const { title, price } = body;

    const params = {
      TableName: "team1",
      Key: {
        PK: `USER#${userId}`,
        SK: `CART#ITEM#${productId}`,
      },
      // SET title, price, etc. and atomically increment the Quantity attribute
      UpdateExpression:
        "SET Title = :title, PriceAtAdded = :price, DateAdded = :date ADD Quantity :incr",
      ExpressionAttributeValues: {
        ":title": title,
        ":price": price,
        ":date": new Date().toISOString(),
        ":incr": 1, // This will increment the number by 1 each time
      },
      ReturnValues: "UPDATED_NEW",
    };

    await docClient.send(new UpdateCommand(params));

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({
        message: "The item quantity was updated in cart!",
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Error adding item.",
        error: error.message,
      }),
    };
  }
};
