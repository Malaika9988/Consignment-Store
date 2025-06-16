require('dotenv').config();
const express = require('express');
const productRoutes = require('./routes/productRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware to parse JSON
app.use(express.json());

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to the API! Use /api/products for API routes.');
});

// Mount Product Routes
app.use('/api/products', productRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});