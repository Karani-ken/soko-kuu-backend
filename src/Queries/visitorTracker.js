const showVisitorsTracker = `SHOW TABLES LIKE "visitors"`;

const createVisitorTable = `CREATE TABLE visitors(
tracker_id INT AUTO_INCREMENT PRIMARY KEY,
ip VARCHAR(45),
userAgent Text,
timestamp DATETIME
);`

const insertVisitor = `INSERT INTO visitors (ip, userAgent, timestamp) VALUES (?, ?, ?)`;// Daily Stats: Counts number of visitors for each day



const getVisitors = `SELECT * FROM visitors`;

//product-views
const showProductViewsTable = `SHOW TABLES LIKE "product_views"`;

const createProductViewsTable = `CREATE TABLE product_views(
  view_id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT,
  ip VARCHAR(45),
  userAgent TEXT,
  timestamp DATETIME,
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);`

const insertProductView = `INSERT INTO product_views (product_id, ip, userAgent, timestamp) VALUES (?, ?, ?, ?);`

const getProductViews = `SELECT * FROM product_views WHERE product_id = ?;`


//business_views
const showBusinessViewsTable = `SHOW TABLES LIKE "business_views"`;

const createBusinessViewsTable = `CREATE TABLE business_views (
  view_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  ip VARCHAR(45),
  userAgent TEXT,
  timestamp DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);`

const insertBusinessView = `INSERT INTO business_views (user_id, ip, userAgent, timestamp) VALUES (?, ?, ?, ?);`

const getBusinessViews = `SELECT * FROM business_views WHERE user_id = ?;`

module.exports = {
    showVisitorsTracker,
    createVisitorTable,
    insertVisitor,
    getVisitors,
    showBusinessViewsTable,
    createBusinessViewsTable,
    showProductViewsTable,
    createProductViewsTable,
    insertBusinessView,
    insertProductView,
    getBusinessViews,
    getProductViews
}