import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "team1";

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
    const scanParams = {
      TableName: TABLE_NAME,
      FilterExpression: "SK = :sk",
      ExpressionAttributeValues: {
        ":sk": "METADATA",
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

    const products = Items.map((item) => ({
      id: item.PK?.replace("ITEM#", ""),
      title: item.Title || item.title || "No Title",
      description: item.Description || "",
      category: item.Category || item.category || "",
      material: item.Material || item.material || "",
      color: item.Color || item.color || "",
      size: item.Size || "",
      price: item.price || "0",
      inventory: item.InventoryCount || "0",
    }));

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
