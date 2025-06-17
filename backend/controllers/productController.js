const supabase = require('../config/supabaseClient');

// 1. Health check
exports.testConnection = async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*').limit(1);
    if (error) throw error;
    res.json({ message: 'Successfully connected to Supabase!', data });
  } catch (err) {
    res.status(500).json({ message: 'Error connecting to Supabase!', error: err.message });
  }
};

// 2. Add a new consignor
exports.addConsignor = async (req, res) => {
  const { full_name, email, phone_number, address, bank_details } = req.body;
  try {
    const { data, error } = await supabase
      .from('consignors')
      .insert([{ full_name, email, phone_number, address, bank_details }])
      .select();                    // ← return inserted row(s)
    if (error) throw error;
    res.status(201).json({ message: 'Consignor added successfully!', data });
  } catch (err) {
    res.status(500).json({ message: 'Error adding consignor!', error: err.message });
  }
};

// 3. Fetch all products
exports.getAllProducts = async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products!', error: err.message });
  }
};

// 4. Add a new product
exports.addProduct = async (req, res) => {
  const {
    name, category, condition, consignor_id,
    description, specifications,
    expected_price, minimum_price,
    quantity, image_url
  } = req.body;

  try {
    // 4a. verify consignor exists
    const { data: consignor, error: checkError } = await supabase
      .from('consignors')
      .select('id')
      .eq('id', consignor_id)
      .single();

    if (checkError || !consignor) {
      return res.status(400).json({ message: 'Consignor not found. Please add consignor first.' });
    }

    // 4b. insert product
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name, category, condition, consignor_id,
        description, specifications,
        expected_price, minimum_price,
        quantity, image_url
      }])
      .select();                 // ← return inserted row(s)
    if (error) throw error;

    res.status(201).json({ message: 'Product added successfully!', data });
  } catch (err) {
    res.status(500).json({ message: 'Error adding product!', error: err.message });
  }
};



