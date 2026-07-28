import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import Stripe from "stripe";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const TABLE_NAME = process.env.TABLE_NAME || "team1";
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

const clearCartForUser = async (userId) => {
  const { Items: cartMappings } = await docClient.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": `USER#${userId}`,
        ":skPrefix": "CART#ITEM#",
      },
    }),
  );

  if (!cartMappings || cartMappings.length === 0) return;

  await docClient.send(
    new BatchWriteCommand({
      RequestItems: {
        [TABLE_NAME]: cartMappings.map((item) => ({
          DeleteRequest: { Key: { PK: item.PK, SK: item.SK } },
        })),
      },
    }),
  );
};

export const handler = async (event) => {
  const signature = event.headers["stripe-signature"] || event.headers["Stripe-Signature"];
  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body, "base64")
    : event.body;

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody, signature, WEBHOOK_SECRET);
  } catch (error) {
    console.error("Webhook signature verification failed:", error.message);
    return { statusCode: 400, body: `Webhook Error: ${error.message}` };
  }

  try {
    if (stripeEvent.type === "checkout.session.completed") {
      const session = stripeEvent.data.object;
      const userId = session.client_reference_id;

      if (userId) {
        await clearCartForUser(userId);
      }
    }

    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  } catch (error) {
    console.error("Error handling webhook event:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
