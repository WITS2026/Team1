import { jest, describe, test, expect, beforeEach } from "@jest/globals";

// Mock the DynamoDB Document Client send method using jest.unstable_mockModule for ES Modules
jest.unstable_mockModule("@aws-sdk/lib-dynamodb", () => ({
  DynamoDBDocumentClient: {
    from: jest.fn().mockReturnValue({
      send: jest.fn(),
    }),
  },
  UpdateCommand: jest.fn().mockImplementation((params) => ({ input: params })),
}));

// Dynamically import dependencies after mocking
const { handler } = await import("./index.mjs");
const { DynamoDBDocumentClient } = await import("@aws-sdk/lib-dynamodb");

describe("addToCart Lambda Handler", () => {
  let mockSend;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSend = DynamoDBDocumentClient.from().send;
  });

  // Test 1: Successful addition to cart (200 Status)
  test("returns 200 and success message when item is added to cart", async () => {
    mockSend.mockResolvedValueOnce({});

    const mockEvent = {
      requestContext: {
        authorizer: {
          jwt: {
            claims: { sub: "user-123" },
          },
        },
      },
      pathParameters: { productId: "prod-456" },
      body: JSON.stringify({
        title: "Gold Necklace",
        price: 99.99,
      }),
    };

    const response = await handler(mockEvent);

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.message).toBe("The item quantity was updated in cart!");
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  // Test 2: Verifies correct DynamoDB update parameters
  test("constructs correct DynamoDB update keys and parameters", async () => {
    mockSend.mockResolvedValueOnce({});

    const mockEvent = {
      requestContext: {
        authorizer: {
          jwt: {
            claims: { sub: "user-789" },
          },
        },
      },
      pathParameters: { productId: "item-999" },
      body: JSON.stringify({
        title: "Diamond Ring",
        price: 250.0,
      }),
    };

    await handler(mockEvent);

    const sentCommand = mockSend.mock.calls[0][0];
    expect(sentCommand.input.TableName).toBe("team1");
    expect(sentCommand.input.Key).toEqual({
      PK: "USER#user-789",
      SK: "CART#ITEM#item-999",
    });
    expect(sentCommand.input.ExpressionAttributeValues[":title"]).toBe(
      "Diamond Ring",
    );
    expect(sentCommand.input.ExpressionAttributeValues[":price"]).toBe(250.0);
  });

  // Test 3: Handles DynamoDB or parsing errors (500 Status)
  test("returns 500 status code when DynamoDB operation throws an error", async () => {
    mockSend.mockRejectedValueOnce(new Error("DynamoDB connection failure"));

    const mockEvent = {
      requestContext: {
        authorizer: {
          jwt: {
            claims: { sub: "user-123" },
          },
        },
      },
      pathParameters: { productId: "prod-456" },
      body: JSON.stringify({
        title: "Silver Bracelet",
        price: 45.0,
      }),
    };

    const response = await handler(mockEvent);

    expect(response.statusCode).toBe(500);
    const body = JSON.parse(response.body);
    expect(body.message).toBe("Error adding item.");
    expect(body.error).toBe("DynamoDB connection failure");
  });
});
