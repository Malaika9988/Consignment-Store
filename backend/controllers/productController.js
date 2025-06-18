// controllers/productController.js

// --- In-memory database (REPLACE THIS WITH YOUR ACTUAL DATABASE LOGIC) ---
// This is for demonstration and immediate testing.
// In a real application, this would interact with a database.
let products = [
    {
        id: 1,
        name: "Vintage Leather Bag",
        description: "A classic leather shoulder bag.",
        price: 120.00,
        consignor_id: 101,
        consignor_name: "Emma Stone",
        category: "Accessories",
        condition: "Used - Good",
        quantity: 1,
        commission_rate: 0.30,
        barcode: "ABC123456789",
        image_url: "https://example.com/bag.jpg",
        location: { floor: "1", aisle: "A", rack: "R1", bin: "B1" },
        updated_by: "John Doe",
        notes: "Small scuff on bottom.",
        created_at: "2023-01-15T10:00:00Z",
        updated_at: "2023-01-15T10:00:00Z",
        status: "in_stock",
    },
    {
        id: 2,
        name: "Designer Silk Scarf",
        description: "Hand-printed silk scarf.",
        price: 75.00,
        consignor_id: 102,
        consignor_name: "Liam White",
        category: "Accessories",
        condition: "New",
        quantity: 2,
        commission_rate: 0.25,
        barcode: "DEF987654321",
        image_url: "https://example.com/scarf.jpg",
        location: { floor: "1", aisle: "B", rack: "R2", bin: "B3" },
        updated_by: "Jane Smith",
        notes: null,
        created_at: "2023-02-20T11:30:00Z",
        updated_at: "2023-02-20T11:30:00Z",
        status: "in_stock",
    },
];
let nextProductId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
// --- End in-memory database setup ---


// Health-check controller
exports.testConnection = (req, res) => {
    console.log(`[${new Date().toISOString()}] GET /api/products/test-connection called.`);
    res.status(200).send('Backend connection successful!');
};

// Add a consignor controller (basic placeholder)
exports.addConsignor = (req, res) => {
    console.log(`[${new Date().toISOString()}] POST /api/products/add-consignor called. Body:`, req.body);
    // In a real app, you'd save this to a database
    res.status(201).json({ message: 'Consignor added (placeholder)', data: req.body });
};

// Get all products controller
exports.getAllProducts = (req, res) => {
    console.log(`[${new Date().toISOString()}] GET /api/products called. Returning ${products.length} products.`);
    res.status(200).json(products);
};

// Add a product controller (This is the one your frontend calls for adding)
exports.addProduct = (req, res) => {
    const productData = req.body; // The new product data from the frontend

    console.log(`[${new Date().toISOString()}] POST /api/products called. Received data:`, productData);

    // Basic validation (you should add more robust validation)
    if (!productData.name || !productData.price || !productData.consignor_name || !productData.category) {
        // Return an error if essential fields are missing
        return res.status(400).json({ message: 'Missing required product fields (name, price, consignor_name, category).' });
    }

    const now = new Date().toISOString();
    const newProduct = {
        id: nextProductId++, // Assign a new ID
        ...productData, // Spread all properties from the request body
        // Ensure default values or type conversions
        price: parseFloat(productData.price) || 0,
        quantity: parseInt(productData.quantity) || 1,
        commission_rate: parseFloat(productData.commission_rate) || 0,
        consignor_id: productData.consignorId ? parseInt(productData.consignorId.toString().replace('c', '')) : null, // Handles "c123" string
        barcode: productData.barcode || null,
        image_url: productData.image_url || null,
        location: productData.location || null,
        updated_by: productData.updated_by || null,
        notes: productData.notes || null,
        status: productData.status || "in_stock", // Default status
        created_at: now,
        updated_at: now,
    };

    products.push(newProduct); // Add to our in-memory array

    console.log(`[${now}] Product added: ID ${newProduct.id}, Name: ${newProduct.name}. Current total products: ${products.length}`);
    res.status(201).json(newProduct); // Send back the created product with a 201 status
};

// Placeholder for updateProductLocation - you'll fill this in later if needed
exports.updateProductLocation = (req, res) => {
    const productId = parseInt(req.params.id);
    const updateData = req.body;
    console.log(`[${new Date().toISOString()}] PUT /api/products/${productId}/location called. Update data:`, updateData);

    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found for location update.' });
    }

    const product = products[productIndex];
    const now = new Date().toISOString();

    if (updateData.location) {
        product.location = { ...product.location, ...updateData.location };
    }
    if (updateData.quantity !== undefined) {
        product.quantity = parseInt(updateData.quantity);
    }
    if (updateData.updated_by) {
        product.updated_by = updateData.updated_by;
    }
    if (updateData.notes !== undefined) {
        product.notes = updateData.notes;
    }
    product.updated_at = now;

    products[productIndex] = product; // Update the product in the array

    res.status(200).json(product);
};