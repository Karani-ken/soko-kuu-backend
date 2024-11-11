const showCategoriesTable = 'SHOW TABLES LIKE "categories"';
const categoryTable = ` CREATE TABLE categories(
   category_id INT AUTO_INCREMENT PRIMARY KEY,
   category_name VARCHAR(255) UNIQUE,
   banner TEXT
   );`

const insertCategory = `
    INSERT INTO categories (category_name, banner) VALUES (?, ?);   
`

const getCategories = `
    SELECT * FROM categories;
`
const deleteCategory = `DELETE FROM categories WHERE category_id = ?`;

//product categories
const showProductCategoriesTable = 'SHOW TABLES LIKE "product_categories"';
const productCategoryTable = `CREATE TABLE product_categories(
   category_id INT AUTO_INCREMENT PRIMARY KEY,
   category_name VARCHAR(255) UNIQUE,
   category_description TEXT,
   banner TEXT
   );`

   const insertProductCategory = `INSERT INTO product_categories (category_name, category_description, banner) VALUES (?, ?, ?);`

const getProductCategories = `SELECT * FROM product_categories;`
const deleteProductCategory = `DELETE FROM product_categories WHERE category_id = ?`;


const showServiceCategoriesTable = 'SHOW TABLES LIKE "service_categories"';
const serviceCategoryTable = ` CREATE TABLE service_categories(
   category_id INT AUTO_INCREMENT PRIMARY KEY,
   category_name VARCHAR(255) UNIQUE,
   category_description TEXT,
   banner TEXT
   );`

   const insertServiceCategory = `INSERT INTO service_categories (category_name, category_description, banner) VALUES (?, ?, ?);`

const getServiceCategories = `SELECT * FROM service_categories;`
const deleteServiceCategory = `DELETE FROM service_categories WHERE category_id = ?`;
module.exports = {
    showCategoriesTable,
    categoryTable,
    insertCategory,
    getCategories,
    deleteCategory ,
    showProductCategoriesTable,
    productCategoryTable,
    getProductCategories,
    deleteProductCategory,
    insertProductCategory,
    showServiceCategoriesTable,
    serviceCategoryTable,
    insertServiceCategory,
    getServiceCategories,
    deleteServiceCategory
}