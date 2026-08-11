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

  const params = event.queryStringParameters || {};

  const category =
    params.category && params.category !== "all" ? params.category : null;

  const search =
    params.search && params.search.trim() !== ""
      ? params.search.toLowerCase()
      : null;

  const color = params.color && params.color !== "all" ? params.color : null;

  const material =
    params.material && params.material !== "all" ? params.material : null;

  const price = params.price && params.price !== "all" ? params.price : null;

  try {
    // DynamoDB query
    // Only include item rows with metadata records.
    const scanParams = {
      TableName: TABLE_NAME,
      FilterExpression: "SK = :sk AND begins_with(PK, :pkPrefix)",
      ExpressionAttributeValues: {
        ":sk": "METADATA",
        ":pkPrefix": "ITEM#",
      },
    };

    const result = await docClient.send(new ScanCommand(scanParams));

    let Items = result.Items || [];

    // Category filter
    if (category) {
      Items = Items.filter(
        (item) => item.Category === category || item.category === category,
      );
    }

    // Search filter
    if (search) {
      Items = Items.filter((item) =>
        String(item.Title || item.title || "")
          .toLowerCase()
          .includes(search),
      );
    }

    // Color filter
    if (color) {
      Items = Items.filter(
        (item) => item.Color === color || item.color === color,
      );
    }

    // Material filter
    if (material) {
      Items = Items.filter(
        (item) => item.Material === material || item.material === material,
      );
    }

    // Price filter
    if (price) {
      Items = Items.filter((item) => {
        const itemPrice = Number(item.price || item.Price || 0);

        if (price === "low") {
          return itemPrice < 100;
        }

        if (price === "medium") {
          return itemPrice >= 100 && itemPrice <= 500;
        }

        if (price === "high") {
          return itemPrice > 500;
        }

        return true;
      });
    }
      const products = await Promise.all(
            (Items || []).map(async (item) => {
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
                    id: item.PK?.replace("ITEM#", ""),
                    title: item.Title || item.title || "No Title",
                    description: item.Description || "",
                    category: item.Category || item.category || "",
                    material: item.Material || item.material || "",
                    color: item.Color || item.color || "",
                    size: item.Size || "",
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
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(products),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: error.message,
      }),
    };
  }
};
