const express = require('express');
const {
  testConnection,
  addConsignor,
  getAllProducts,
  addProduct
} = require('../controllers/productController');

const router = express.Router();

// Health‑check
router.get('/test-connection', testConnection);

// Add a consignor
router.post('/add-consignor', addConsignor);

// List all products
router.get('/', getAllProducts);

// Add a product
router.post('/add-product', addProduct);

module.exports = router;


