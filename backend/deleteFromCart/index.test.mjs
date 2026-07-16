import { mockClient } from "aws-sdk-client-mock";
import {
  DynamoDBDocumentClient,
  QueryCommand,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { handler } from "./index.mjs";

const ddbMock = mockClient(DynamoDBDocumentClient);

const buildEvent = (productId) => ({
  requestContext: { authorizer: { jwt: { claims: { sub: "user-123" } } } },
  pathParameters: { productId },
});

describe("deleteFromCart handler", () => {
  beforeEach(() => {
    ddbMock.reset();
    process.env.TABLE_NAME = "team1";
  });

  it("returns 400 when productId is missing", async () => {
    const result = await handler(buildEvent(undefined));

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe("Missing productId.");
    expect(ddbMock.commandCalls(QueryCommand)).toHaveLength(0);
  });

  it("returns 404 when the item is not found in the cart", async () => {
    ddbMock.on(QueryCommand).resolves({ Items: [] });

    const result = await handler(buildEvent("42"));

    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body).message).toBe("Item not found in database.");
    expect(ddbMock.commandCalls(QueryCommand)).toHaveLength(1);
  });

  it("deletes the item and returns 200 on success", async () => {
    ddbMock.on(QueryCommand).resolves({
      Items: [{ PK: "USER#user-123", SK: "CART#ITEM#42" }],
    });
    ddbMock.on(BatchWriteCommand).resolves({});

    const result = await handler(buildEvent("42"));

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).message).toBe(
      "Successfully removed item from cart.",
    );

    expect(ddbMock.commandCalls(QueryCommand)).toHaveLength(1);
    expect(ddbMock.commandCalls(BatchWriteCommand)).toHaveLength(1);

    const batchWriteCall = ddbMock.call(1).args[0];
    expect(batchWriteCall.input.RequestItems.team1).toEqual([
      {
        DeleteRequest: {
          Key: { PK: "USER#user-123", SK: "CART#ITEM#42" },
        },
      },
    ]);
  });
});
