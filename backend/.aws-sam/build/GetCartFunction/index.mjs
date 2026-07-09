import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, BatchGetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// Fallback to "team1" if the environment variable isn't configured
const TABLE_NAME = process.env.TABLE_NAME || "team1"; 

export const handler = async (event) => {
    try {
        // FIX: Checks both lowercase 'userId' and uppercase 'userID' path variables
        const userId = event.pathParameters?.userId || event.pathParameters?.userID || "guest_user"; 

        // 1. Fetch all items in the user's cart
        const queryParams = {
            TableName: TABLE_NAME,
            KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
            ExpressionAttributeValues: {
                ":pk": `USER#${userId}`,
                ":skPrefix": "CART#ITEM#"
            }
        };

        const { Items: cartMappings } = await docClient.send(new QueryCommand(queryParams));

        // CORS headers required to allow your React app to read the response safely
        const corsHeaders = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        };

        if (!cartMappings || cartMappings.length === 0) {
            return { 
                statusCode: 200, 
                headers: corsHeaders,
                body: JSON.stringify({ userId, cart: [] }) 
            };
        }

        // 2. Build keys to batch-fetch catalog details for these items
        const batchKeys = cartMappings.map(cartItem => {
            const itemId = cartItem.SK.replace("CART#ITEM#", "");
            return {
                PK: `ITEM#${itemId}`,
                SK: "METADATA" 
            };
        });

        const batchParams = {
            RequestItems: {
                [TABLE_NAME]: {
                    Keys: batchKeys
                }
            }
        };

        const batchResponse = await docClient.send(new BatchGetCommand(batchParams));
        const catalogItems = batchResponse.Responses[TABLE_NAME] || [];

        // 3. Combine cart quantities with catalog titles and prices
        const fullCart = cartMappings.map(cartItem => {
            const itemId = cartItem.SK.replace("CART#ITEM#", "");
            
            // Find the matching catalog detail row
            const details = catalogItems.find(catalog => catalog.PK === `ITEM#${itemId}`);

            return {
                itemId: itemId,
                title: details?.Title || cartItem.Title || "Unknown Item",
                description: details?.Description || "",
                price: details?.price || details?.PriceAtAdded || cartItem.PriceAtAdded || 0,
                quantity: cartItem.Quantity || 1
            };
        });

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ userId, cart: fullCart })
        };

    } catch (error) {
        console.error("Database error:", error);
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({ error: error.message })
        };
    }
};