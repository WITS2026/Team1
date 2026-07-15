const { mockClient } = require("aws-sdk-client-mock");
const {
  DynamoDBDocumentClient,
  QueryCommand,
  BatchGetCommand,
} = require("@aws-sdk/lib-dynamodb");

const ddbMock = mockClient(DynamoDBDocumentClient);
let handler;

beforeAll(async () => {
  ({ handler } = await import("./index.mjs"));
});

describe("Get Cart Lambda Handler", () => {
  beforeEach(() => {
    ddbMock.reset();
  });

  const mockEvent = {
    requestContext: {
      authorizer: {
        jwt: {
          claims: {
            sub: "user_123",
          },
        },
      },
    },
  };

  it("returns cart data combined with catalog details for the signed-in user", async () => {
    ddbMock.on(QueryCommand).resolves({
      Items: [{ PK: "USER#user_123", SK: "CART#ITEM#prod_abc", Quantity: 2 }],
    });

    ddbMock.on(BatchGetCommand).resolves({
      Responses: {
        team1: [
          {
            PK: "ITEM#prod_abc",
            SK: "METADATA",
            Title: "Cool T-Shirt",
            Description: "A very cool shirt",
            price: 25,
          },
        ],
      },
    });

    const response = await handler(mockEvent);
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(200);
    expect(response.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(body.userId).toBe("user_123");
    expect(body.cart).toEqual([
      {
        itemId: "prod_abc",
        title: "Cool T-Shirt",
        description: "A very cool shirt",
        price: 25,
        quantity: 2,
      },
    ]);
  });

  it("returns an empty cart array and skips the catalog lookup when the cart is empty", async () => {
    ddbMock.on(QueryCommand).resolves({ Items: [] });

    const response = await handler(mockEvent);
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(200);
    expect(body.cart).toEqual([]);
    expect(ddbMock.commandCalls(BatchGetCommand)).toHaveLength(0);
  });

  it("returns a 500 status and error message when the database query fails", async () => {
    ddbMock.on(QueryCommand).rejects(new Error("DynamoDB connection timeout"));

    const response = await handler(mockEvent);
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(500);
    expect(body).toHaveProperty("error", "DynamoDB connection timeout");
  });
});
