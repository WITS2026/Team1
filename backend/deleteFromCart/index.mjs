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
    // 1. Swapped cartId to productId to match your exact API Gateway route: /product/{productId}
    let userId = event.pathParameters?.userId;
    let productId = event.pathParameters?.productId;

    // 2. Fallback parser if path parameters aren't mapping automatically
    if ((!userId || !productId) && event.requestContext?.http?.path) {
      const cleanPath = event.requestContext.http.path.replace(/\/$/, "");
      const pathParts = cleanPath.split('/');
      
      if (!userId) {
        userId = event.queryStringParameters?.userId || pathParts[pathParts.length - 3];
      }
      if (!productId) {
        productId = event.queryStringParameters?.productId || pathParts[pathParts.length - 1];
      }
    }

    // 3. Strict safety check
    const invalidIds = ["cart", "resource", "to", "users", "carts", "product"];
    if (!userId || !productId || invalidIds.includes(userId) || invalidIds.includes(productId)) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ 
          message: "Missing valid userId or productId.",
          debugReceivedPath: event.requestContext?.http?.path || "Unknown path"
        }),
      };
    }

    // 4. Aligning partition and sort keys with your item IDs
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