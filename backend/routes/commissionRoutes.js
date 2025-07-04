// backend/routes/commissionRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming your database connection is in backend/db.js

// GET /api/sales - endpoint to fetch sales data from the database
router.get('/sales', async (req, res) => {
    const dateRange = req.query.dateRange || 'all-time';
    let queryText = `
        SELECT
            s.id,
            s.sale_date AS "saleDate",
            p.name AS "productName",
            c.full_name AS "consignorName",
            s.amount,
            s.commission,
            s.payment_method AS "paymentMethod",
            s.consignor_id AS "consignorId"
        FROM
            sales s
        JOIN
            products p ON s.product_id = p.id
        JOIN
            consignors c ON s.consignor_id = c.id
    `;
    let queryParams = [];

    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    const currentDay = today.getDate();

    if (dateRange === 'this-month') {
        queryText += ` WHERE EXTRACT(MONTH FROM s.sale_date) = $1 AND EXTRACT(YEAR FROM s.sale_date) = $2`;
        queryParams = [currentMonth, currentYear];
    } else if (dateRange === 'today') {
        queryText += ` WHERE EXTRACT(DAY FROM s.sale_date) = $1 AND EXTRACT(MONTH FROM s.sale_date) = $2 AND EXTRACT(YEAR FROM s.sale_date) = $3`;
        queryParams = [currentDay, currentMonth, currentYear];
    }
    queryText += ` ORDER BY s.sale_date DESC`;

    try {
        console.log(`[BACKEND] Executing sales query: ${queryText} with params: ${queryParams}`);
        const result = await db.query(queryText, queryParams);
        console.log(`[BACKEND] Fetched ${result.rows.length} sales records.`);
        res.json(result.rows);
    } catch (err) {
        console.error('[BACKEND ERROR] Error fetching sales data from database:', err);
        res.status(500).json({ message: 'Error fetching sales data', error: err.message });
    }
});

// Example endpoint for fetching product data (adjusted to match schema)
router.get('/products', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT
                p.id, p.name, p.category, p.condition, p.description,
                p.expected_price, p.minimum_price, p.quantity, p.image_url,
                p.consignor_id, p.created_at, p.updated_at,
                -- Removed p.status, p.location, p.barcode, p.specifications, p.commission_rate, p.updated_by
                json_build_object('full_name', c.full_name, 'email', c.email) as consignors
            FROM
                products p
            JOIN
                consignors c ON p.consignor_id = c.id
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ message: 'Error fetching products data' });
    }
});


// Example endpoint for adding a product (adjusted to match schema)
router.post('/products', async (req, res) => {
    // Destructuring only fields present in your Products schema
    const { name, category, condition, description, expected_price, minimum_price, quantity, image_url, consignor_id } = req.body;
    try {
        const result = await db.query(
            // INSERT statement includes only fields from your schema
            `INSERT INTO products (name, category, condition, description, expected_price, minimum_price, quantity, image_url, consignor_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING *`,
            // Values array matches the fields in the INSERT statement
            [name, category, condition, description, expected_price, minimum_price, quantity, image_url, consignor_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error adding product:', err);
        res.status(500).json({ message: 'Error adding product', error: err.message });
    }
});


// Example endpoint for fetching all consignors
router.get('/products/consignors', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM consignors ORDER BY full_name'); // This will select 'is_active' too
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching consignors:', err);
        res.status(500).json({ message: 'Error fetching consignors data' });
    }
});

// Example endpoint for adding a consignor (adjusted to match schema)
router.post('/products/add-consignor', async (req, res) => {
    // Removed 'bank_details' from destructuring
    const { full_name, email, phone_number, address, is_active } = req.body;
    try {
        const result = await db.query(
            // Removed 'bank_details' from INSERT statement
            `INSERT INTO consignors (full_name, email, phone_number, address, is_active)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            // Values array matches the fields in the INSERT statement, handling 'is_active' default
            [full_name, email, phone_number, address, is_active !== undefined ? is_active : true]
        );
        res.status(201).json({ message: 'Consignor added successfully', data: result.rows[0] });
    } catch (err) {
        console.error('Error adding consignor:', err);
        res.status(500).json({ message: 'Error adding consignor', error: err.message });
    }
});

// Example endpoint for fetching a single consignor by ID
router.get('/products/consignors/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM consignors WHERE id = $1', [id]); // This will select 'is_active' too
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Consignor not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching consignor by ID:', err);
        res.status(500).json({ message: 'Error fetching consignor data', error: err.message });
    }
});

// Example endpoint for updating a consignor (adjusted to match schema)
router.put('/products/consignors/:id', async (req, res) => {
    const { id } = req.params;
    // Removed 'bank_details' from destructuring
    const { full_name, email, phone_number, address, is_active } = req.body;

    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (full_name !== undefined) { updates.push(`full_name = $${paramIndex++}`); values.push(full_name); }
    if (email !== undefined) { updates.push(`email = $${paramIndex++}`); values.push(email); }
    if (phone_number !== undefined) { updates.push(`phone_number = $${paramIndex++}`); values.push(phone_number); }
    if (address !== undefined) { updates.push(`address = $${paramIndex++}`); values.push(address); }
    // Removed bank_details handling
    if (is_active !== undefined) { updates.push(`is_active = $${paramIndex++}`); values.push(is_active); }

    updates.push(`updated_at = NOW()`); // Always update `updated_at`

    if (updates.length === 1 && updates[0] === 'updated_at = NOW()') {
        return res.status(400).json({ message: 'No valid fields provided for consignor update.' });
    }

    values.push(id); // The ID is always the last parameter

    try {
        const queryText = `UPDATE consignors SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
        const result = await db.query(queryText, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Consignor not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating consignor:', err);
        res.status(500).json({ message: 'Error updating consignor', error: err.message });
    }
});

// Example endpoint for deleting a consignor
router.delete('/products/consignors/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM consignors WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Consignor not found' });
        }
        res.status(204).send();
    } catch (err) {
        console.error('Error deleting consignor:', err);
        res.status(500).json({ message: 'Error deleting consignor', error: err.message });
    }
});


// Example endpoint for deleting a product
router.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(204).send();
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ message: 'Error deleting product', error: err.message });
    }
});

// Example endpoint for updating product fields (adjusted to match schema)
router.put('/products/:id/location', async (req, res) => {
    const { id } = req.params;
    // Destructure only fields present in your Products schema
    const { name, category, condition, description, expected_price, minimum_price, quantity, image_url, consignor_id } = req.body;

    const updates = [];
    const values = [];
    let paramIndex = 1;

    // Dynamically build updates based on provided fields and your schema
    if (name !== undefined) { updates.push(`name = $${paramIndex++}`); values.push(name); }
    if (category !== undefined) { updates.push(`category = $${paramIndex++}`); values.push(category); }
    if (condition !== undefined) { updates.push(`condition = $${paramIndex++}`); values.push(condition); }
    if (description !== undefined) { updates.push(`description = $${paramIndex++}`); values.push(description); }

    if (expected_price !== undefined) { updates.push(`expected_price = $${paramIndex++}`); values.push(parseFloat(expected_price)); }
    if (minimum_price !== undefined) { updates.push(`minimum_price = $${paramIndex++}`); values.push(parseFloat(minimum_price)); }
    if (quantity !== undefined) { updates.push(`quantity = $${paramIndex++}`); values.push(parseInt(quantity)); }
    if (image_url !== undefined) { updates.push(`image_url = $${paramIndex++}`); values.push(image_url); }
    if (consignor_id !== undefined) { updates.push(`consignor_id = $${paramIndex++}`); values.push(parseInt(consignor_id)); }

    updates.push(`updated_at = NOW()`); // Always update timestamp

    if (updates.length === 1 && updates[0] === 'updated_at = NOW()') {
        return res.status(400).json({ message: 'No valid fields provided for product update.' });
    }

    values.push(id); // The product ID is the last parameter

    try {
        const queryText = `UPDATE products SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
        const result = await db.query(queryText, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json({ message: 'Error updating product', error: err.message });
    }
});


module.exports = router;