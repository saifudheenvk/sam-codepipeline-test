const { updateProduct, createProduct, deleteProduct, listProducts } = require("./product");


exports.handler = async (event) => {
  
    try {
        const body = JSON.parse(event?.body || '{}');

        console.log("Request body", body);
    
        switch (event.httpMethod) {
        case 'POST':
            return createProduct(body);
        case 'PATCH':
            return updateProduct(body);
        case 'DELETE':
            return deleteProduct(body.productId);
        case 'GET':
            return listProducts();
        default:
            throw new Error('Method not allowed');
        }
    } catch (error) {
        console.error("Error", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error", error: error.message })
        };
    }
  };