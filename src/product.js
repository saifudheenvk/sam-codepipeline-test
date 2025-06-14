const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, UpdateCommand, DeleteCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const dynamoDBClient = new DynamoDBClient({
    region: process.env.AWS_REGION
});

const ddbDocClient = DynamoDBDocumentClient.from(dynamoDBClient, {
    marshallOptions: {
        convertClassInstanceToMap: true,
    },
});

const createSuccessResponse = (responseBody, statusCode, headers) => {
    let response = {
        "body": responseBody === undefined ? "" : JSON.stringify(responseBody),
        "statusCode": statusCode ? statusCode : STATUS_CODES.OK,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "cache-control": "max-age=0"
        }
    };
    response.headers = {...response.headers, ...headers};
    return response;
}

function generateId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

const updateProduct = async (product) => {
    const { productId, ...updates } = product;
    updates.updatedAt = new Date().toISOString();

    const updateParams = {
    TableName: process.env.PRODUCT_TABLE,
    Key: { productId },
    UpdateExpression: 'set #name = :name, description = :desc, price = :price, category = :cat, stock = :stock, updatedAt = :updatedAt',
    ExpressionAttributeNames: {
        '#name': 'Name',
        '#desc': 'Description',
        '#price': 'Price',
        '#category': 'Category',
        '#stock': 'Stock'
      },
    ExpressionAttributeValues: {
        ':name': updates.name,
        ':desc': updates.description,
        ':price': updates.price,
        ':cat': updates.category,
        ':stock': updates.stock,
        ':updatedAt': updates.updatedAt
    },
    ReturnValues: 'ALL_NEW'
    };

    const result = await ddbDocClient.send(new UpdateCommand(updateParams));
    return createSuccessResponse(result.Attributes, 200);
};

const deleteProduct = async (productId) => {
    const deleteParams = {
        TableName: process.env.PRODUCT_TABLE,
        Key: { productId }
    };
    await ddbDocClient.send(new DeleteCommand(deleteParams));
    return createSuccessResponse(null, 204);
};

const createProduct = async (product) => {
    const params = {
        TableName: process.env.PRODUCT_TABLE,
        Item: {
            ...product,
            id: generateId()
        }
    };
    await ddbDocClient.send(new PutCommand(params));
    return createSuccessResponse(product, 201);
};

const listProducts = async () => {
    const params = {
        TableName: process.env.PRODUCT_TABLE
    };
    const result = await ddbDocClient.send(new ScanCommand(params));
    return createSuccessResponse(result.Items, 200);
};

module.exports = {
    updateProduct,
    deleteProduct,
    createProduct,
    listProducts
};