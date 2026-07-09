import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "team1";

export const handler = async (event) => {
    try {
        const scanParams = {
            TableName: TABLE_NAME,
            // 1. Changed "SK" to "#sk" to bypass the reserved keyword rule
            FilterExpression: "begins_with(PK, :itemPrefix) AND #sk = :metadataSuffix",
            // 2. Map "#sk" directly to the real "SK" column name
            ExpressionAttributeNames: {
                "#sk": "SK"
            },
            ExpressionAttributeValues: {
                ":itemPrefix": "ITEM#",
                ":metadataSuffix": "METADATA"
            }
        };

        const { Items } = await docClient.send(new ScanCommand(scanParams));

        const products = (Items || []).map(item => {
            const itemId = item.PK.replace("ITEM#", ""); 

            return {
                id: itemId,
                title: item.Title || "No Title",
                description: item.Description || "",
                price: item.price || "0", 
                inventory: item.InventoryCount || "0"
            };
        });

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*" 
            },
            body: JSON.stringify(products)
        };

    } catch (error) {
        console.error("Database error:", error);
        
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: "Failed to fetch products from database." })
        };
    }
};