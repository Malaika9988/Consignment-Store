require('dotenv').config();
const express = require('express');
const productRoutes = require('./routes/productRoutes');
const errorHandler  = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 8000;

// Parse JSON bodies
app.use(express.json());

// Mount all routes under /api/products
app.use('/api/products', productRoutes);

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
