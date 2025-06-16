require('dotenv').config();
const express = require('express');
const productRoutes = require('./routes/productRoutes');
const errorHandler = require('./middlewares/errorHandler');
const supabase = require('./config/supabaseClient'); 

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());


// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to the API! Use /products for API routes.');
});

// Product Routes
app.use('/products', productRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});


