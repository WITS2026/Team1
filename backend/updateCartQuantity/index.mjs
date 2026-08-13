import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    const claims = event.requestContext.authorizer.jwt.claims;
    const userId = claims.sub;

    const { productId } = event.pathParameters || {};
    const body = event.body ? JSON.parse(event.body) : {};
    const quantity = Number(body.quantity || 0);

    if (!productId) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ message: "Missing productId." }),
      };
    }

    const partitionKey = `USER#${userId}`;
    const sortKey = `CART#ITEM#${productId}`;

    if (quantity <= 0) {
      // Remove item from cart
      const delParams = {
        TableName: "team1",
        Key: { PK: partitionKey, SK: sortKey },
      };

      await docClient.send(new DeleteCommand(delParams));

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "DELETE,OPTIONS,PUT",
        },
        body: JSON.stringify({ message: "Item removed from cart." }),
      };
    }

    const updateParams = {
      TableName: "team1",
      Key: { PK: partitionKey, SK: sortKey },
      UpdateExpression: "SET Quantity = :qty, DateUpdated = :date",
      ExpressionAttributeValues: {
        ":qty": quantity,
        ":date": new Date().toISOString(),
      },
      ReturnValues: "UPDATED_NEW",
    };

    await docClient.send(new UpdateCommand(updateParams));

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "PUT,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
      },
      body: JSON.stringify({ message: "Quantity updated." }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Error updating quantity.", error: error.message }),
    };
  }
};
