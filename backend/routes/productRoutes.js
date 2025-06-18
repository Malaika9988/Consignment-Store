// routes/productRoutes.js

const express = require('express');
const {
    testConnection,
    addConsignor,
    getAllProducts,
    addProduct,
    updateProductLocation // Assuming you might use this later
} = require('../controllers/productController');

const router = express.Router();

// Health-check
router.get('/test-connection', testConnection);

// Add a consignor (e.g., POST to /api/products/add-consignor)
router.post('/add-consignor', addConsignor);

// List all products (GET /api/products)
router.get('/', getAllProducts);

// Add a product (POST /api/products) - THIS IS THE KEY CHANGE
router.post('/', addProduct); // Changed from '/add-product' to '/'

// Update product location (e.g., PUT /api/products/:id/location)
// Assuming you'll implement this fully later
router.put('/:id/location', updateProductLocation);


module.exports = router;