const supabase = require('../config/supabaseClient'); // Assuming supabaseClient.js is in a 'config' folder

// Test database connection
exports.testConnection = async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*').limit(1);
    if (error) throw error;

    res.status(200).json({
      message: 'Successfully connected to Supabase!',
      data,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Error connecting to Supabase!',
      error: err.message,
    });
  }
};

// Fetch all products
exports.getAllProducts = async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({
      message: 'Error fetching products!',
      error: err.message,
    });
  }
};

// Add a new product
exports.addProduct = async (req, res) => {
  const { name, category, condition, consignor_id, description, specifications, expected_price, minimum_price, quantity, image_url } = req.body;

  try {
    const { data, error } = await supabase.from('products').insert([
      {
        name,
        category,
        condition,
        consignor_id,
        description,
        specifications,
        expected_price,
        minimum_price,
        quantity,
        image_url,
      },
    ]);

    if (error) throw error;

    res.status(201).json({
      message: 'Product added successfully!',
      data,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Error adding product!',
      error: err.message,
    });
  }
};
