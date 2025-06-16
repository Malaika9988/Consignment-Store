const express = require('express');
const { getAllProducts, addProduct, testConnection } = require('../controller/productController');

const router = express.Router();

// Route to fetch all products
router.get('/', getAllProducts);

// Route to add a product
router.post('/add-product', addProduct);

// Route to test database connection
router.get('/test-connection', testConnection);

module.exports = router;
