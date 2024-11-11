const showProductTable = 'SHOW TABLES LIKE "products"';

const productsTable = `CREATE TABLE products (
    product_id BINARY(16) PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    product_price DECIMAL(10, 2) NOT NULL,
    product_description TEXT,
    user_id INT NOT NULL,
    quantity INT,
    product_images TEXT,
    public_ids TEXT,
    category VARCHAR(100),
    color TEXT,
    size VARCHAR(50),
    discount INT;  
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`
const insertProduct = `INSERT INTO products (product_id , product_name, product_description, product_price, quantity, product_images,category, color, size,user_id) 
VALUES (UNHEX(REPLACE(UUID(), '-', '')), ?, ?, ?, ?, ?, ?, ?, ?, ?);
`

const getProducts = `SELECT HEX(product_id) as product_id , product_name, product_description, product_price, quantity, product_images,category, color, size,user_id FROM products;
`

const getProduct = `SELECT HEX(product_id) as product_id , product_name, product_description, product_price, quantity, product_images,category, color, size,user_id  FROM products WHERE product_id = UNHEX(?);      
`

const getBusinessProducts = `SELECT HEX(product_id) as product_id , product_name, product_description, product_price, quantity, product_images,category, color, size,user_id  FROM products WHERE user_id = ?;
`
const updateQuantity = `UPDATE products SET quantity = ? WHERE product_id = UNHEX(?)`

const updateProducts = `UPDATE products 
SET product_name = ?, product_price = ?, quantity = ?, product_description = ?,category = ?, color = ?, size = ?
WHERE product_id = UNHEX(?);     
`
const setDiscount = `UPDATE products SET  discount = ? WHERE product_id = UNHEX(?)`

const deleteProduct = `DELETE FROM products WHERE product_id = ?;
`
const deleteProductWithUserId = `DELETE from products WHERE user_id = UNHEX(?)`   

const updateProductImages = `UPDATE products
SET product_images = ? WHERE product_id = UNHEX(?);
`
   
const getProductsByCategory = `SELECT HEX(product_id) as product_id , product_name, product_description, product_price, quantity, product_images,category, color, size,user_id  FROM products WHERE category = ?`

const getProductsOnOffer = `SELECT HEX(product_id) as product_id , product_name, product_description, product_price, quantity, product_images,category, color, size,user_id  FROM products WHERE discount = "yes"`

module.exports = {
    showProductTable,
    insertProduct,
    productsTable,
    getProduct,
    getProducts,
    getBusinessProducts,
    updateProducts,
    deleteProduct,
    setDiscount,
    deleteProductWithUserId,
    updateProductImages,
    getProductsByCategory,
    getProductsOnOffer,
    updateQuantity
}




