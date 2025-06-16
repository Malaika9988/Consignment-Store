const supabase = require("../config/supabaseClient");

// Add a new product
const addProduct = async (req, res) => {
  const {
    name,
    category,
    condition,
    consignor_id,
    description,
    specifications,
    expected_price,
    minimum_price,
    quantity = 1,
    image_url,
  } = req.body;

  try {
    const sanitizedName = name.trim().toLowerCase();

    // Check if the product already exists
    const { data: existingProducts, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .ilike("name", sanitizedName);

    if (fetchError) throw fetchError;

    if (existingProducts && existingProducts.length > 0) {
      return res.status(409).json({ message: "Product already exists" });
    }

    // Insert the new product
    const { data, error } = await supabase.from("products").insert([
      {
        name: sanitizedName,
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

    res.status(201).json({ message: "Product added successfully", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch all products
const getAllProducts = async (req, res) => {
  try {
    const { data, error } = await supabase.from("products").select("*");

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

// Test database connection
const testConnection = async (req, res) => {
  try {
    const { data, error } = await supabase.from("products").select("id").limit(1);
    if (error) throw error;

    res.status(200).json({ message: "Database is connected successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Database connection failed. " + err.message });
  }
};

module.exports = { addProduct, getAllProducts, testConnection };
