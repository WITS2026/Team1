import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const s3Client = new S3Client({});
const TABLE_NAME = "team1";
const BUCKET_NAME = process.env.BUCKET_NAME;

export const handler = async (event) => {
    try {
        const scanParams = {
            TableName: TABLE_NAME,
            FilterExpression: "begins_with(PK, :itemPrefix) AND #sk = :metadataSuffix",
            ExpressionAttributeNames: {
                "#sk": "SK"
            },
            ExpressionAttributeValues: {
                ":itemPrefix": "ITEM#",
                ":metadataSuffix": "METADATA"
            }
        };

        const { Items } = await docClient.send(new ScanCommand(scanParams));
        const products = await Promise.all(
            (Items || []).map(async (item) => {
                const itemId = item.PK.replace("ITEM#", "");

                let imageUrl = null;
                if (item.ImageKey) {
                    const command = new GetObjectCommand({
                        Bucket: BUCKET_NAME,
                        Key: item.ImageKey
                    });

                    imageUrl = await getSignedUrl(s3Client, command, {
                        expiresIn: 3600 // 1 hour
                    });
                }

                return {
                    id: itemId,
                    title: item.Title || "No Title",
                    description: item.Description || "",
                    price: item.price || "0",
                    inventory: item.InventoryCount || "0",
                    imageUrl
                };
            })
        );

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