import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, BatchGetCommand } from "@aws-sdk/lib-dynamodb";
import Stripe from "stripe";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const TABLE_NAME = process.env.TABLE_NAME || "team1";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Re-reads the cart straight from DynamoDB so prices always come from the
// database, never from the client request.
const getCartItemsForUser = async (userId) => {
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

  if (!cartMappings || cartMappings.length === 0) return [];

  const batchKeys = cartMappings.map((cartItem) => ({
    PK: `ITEM#${cartItem.SK.replace("CART#ITEM#", "")}`,
    SK: "METADATA",
  }));

  const batchResponse = await docClient.send(
    new BatchGetCommand({
      RequestItems: { [TABLE_NAME]: { Keys: batchKeys } },
    }),
  );
  const catalogItems = batchResponse.Responses[TABLE_NAME] || [];

  return cartMappings.map((cartItem) => {
    const itemId = cartItem.SK.replace("CART#ITEM#", "");
    const details = catalogItems.find((catalog) => catalog.PK === `ITEM#${itemId}`);

    return {
      title: details?.Title || cartItem.Title || "Unknown Item",
      price: details?.price || details?.PriceAtAdded || cartItem.PriceAtAdded || 0,
      quantity: cartItem.Quantity || 1,
    };
  });
};

export const handler = async (event) => {
  try {
    const claims = event.requestContext.authorizer.jwt.claims;
    const userId = claims.sub;

    const cartItems = await getCartItemsForUser(userId);

    if (cartItems.length === 0) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Your cart is empty." }),
      };
    }

    const requestOrigin = event.headers?.origin || event.headers?.Origin;
    const baseUrl = requestOrigin || FRONTEND_URL;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      client_reference_id: userId,
      line_items: cartItems.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: { name: item.title },
          unit_amount: Math.round(Number(item.price) * 100),
        },
        quantity: item.quantity,
      })),
      success_url: `${baseUrl}/payment-success`,
      cancel_url: `${baseUrl}/payment-cancel`,
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Unable to start checkout.", error: error.message }),
    };
  }
};
