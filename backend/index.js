require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors'); // Import the CORS middleware
const productRoutes = require('./routes/productRoutes'); // Your product-specific routes
const errorHandler = require('./middlewares/errorHandler'); // Your global error handler middleware (assuming you have one)

const app = express();
const PORT = process.env.PORT || 8000; // Use port from .env or default to 8000

// --- MIDDLEWARE ---

// Enable CORS for all origins.
app.use(cors());

// Parse JSON request bodies (e.g., for POST requests)
app.use(express.json());

// Define a root route for `/`
app.get('/', (req, res) => {
    res.send('Welcome to the API! Use /api/products to interact with products.');
});

// Mount your product routes under the '/api/products' base path.
app.use('/api/products', productRoutes);

// Global error handler middleware. This should be defined last.
app.use(errorHandler);

// --- SERVER START ---
// Start the Express server
console.log('--- Backend Server Starting NOW - Final Version ---');
app.listen(PORT, () => {
    console.log(`Server running: http://localhost:${PORT}`);
});
