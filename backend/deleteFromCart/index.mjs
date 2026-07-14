import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

export const handler = async (event) => {
  try {
    const claims = event.requestContext.authorizer.jwt.claims;
    const userId = claims.sub;
    const productId = event.pathParameters?.productId;

    if (!productId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Missing productId." }),
      };
    }

    // Aligning partition and sort keys with your item IDs
    const partitionKey = `USER#${userId}`;
    const sortKey = `CART#ITEM#${productId}`; // Now evaluates correctly to e.g., CART#ITEM#003

    // --- STEP 1: Find the item to delete ---
    const queryParams = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :pk AND SK = :sk",
      ExpressionAttributeValues: {
        ":pk": partitionKey,
        ":sk": sortKey,
      },
    };

    const queryResponse = await docClient.send(new QueryCommand(queryParams));
    const itemsToDelete = queryResponse.Items || [];

    if (itemsToDelete.length === 0) {
      return {
        statusCode: 404, // Return a 404 if nothing was found to delete so the frontend knows
        headers: corsHeaders,
        body: JSON.stringify({ message: "Item not found in database.", userId, productId }),
      };
    }

    // --- STEP 2: Build and execute delete request ---
    const deleteRequests = itemsToDelete.map((item) => ({
      DeleteRequest: {
        Key: {
          PK: item.PK,
          SK: item.SK,
        },
      },
    }));

    const batchParams = {
      RequestItems: {
        [TABLE_NAME]: deleteRequests,
      },
    };
    
    await docClient.send(new BatchWriteCommand(batchParams));

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ 
        message: "Successfully removed item from cart.", 
        userId,
        productId
      }),
    };

  } catch (error) {
    console.error("Error deleting item:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        message: "Internal server error occurred.", 
        error: error.message 
      }),
    };
  }
};