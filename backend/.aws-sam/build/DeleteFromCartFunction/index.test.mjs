import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@aws-sdk/client-dynamodb", () => ({
  DynamoDBClient: vi.fn(),
}));

vi.mock("@aws-sdk/lib-dynamodb", () => ({
  DynamoDBDocumentClient: { from: vi.fn(() => ({ send: vi.fn() })) },
  QueryCommand: vi.fn(function QueryCommand(params) {
    this.params = params;
  }),
  BatchWriteCommand: vi.fn(function BatchWriteCommand(params) {
    this.params = params;
  }),
}));

process.env.TABLE_NAME = "team1";

const { DynamoDBDocumentClient } = await import("@aws-sdk/lib-dynamodb");
const { handler } = await import("./index.mjs");

const send = DynamoDBDocumentClient.from.mock.results[0].value.send;

const buildEvent = (productId) => ({
  requestContext: { authorizer: { jwt: { claims: { sub: "user-123" } } } },
  pathParameters: { productId },
});

describe("deleteFromCart handler", () => {
  beforeEach(() => {
    send.mockReset();
  });

  it("returns 400 when productId is missing", async () => {
    const result = await handler(buildEvent(undefined));

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe("Missing productId.");
    expect(send).not.toHaveBeenCalled();
  });

  it("returns 404 when the item is not found in the cart", async () => {
    send.mockResolvedValueOnce({ Items: [] });

    const result = await handler(buildEvent("42"));

    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body).message).toBe("Item not found in database.");
  });

  it("deletes the item and returns 200 on success", async () => {
    send
      .mockResolvedValueOnce({
        Items: [{ PK: "USER#user-123", SK: "CART#ITEM#42" }],
      })
      .mockResolvedValueOnce({});

    const result = await handler(buildEvent("42"));

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).message).toBe(
      "Successfully removed item from cart.",
    );

    const batchWriteCall = send.mock.calls[1][0];
    expect(batchWriteCall.params.RequestItems.team1).toEqual([
      {
        DeleteRequest: {
          Key: { PK: "USER#user-123", SK: "CART#ITEM#42" },
        },
      },
    ]);
  });
});
