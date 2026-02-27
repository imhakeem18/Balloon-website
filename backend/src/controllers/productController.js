// src/controllers/productController.js
const db = require('../config/database');

// Get all products with optional filters
exports.getAllProducts = async (req, res) => {
    try {
        const { category, subcategory, type, search } = req.query;
        
        let query = 'SELECT * FROM products WHERE is_active = true';
        const params = [];
        
        // Apply filters
        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }
        
        if (subcategory) {
            query += ' AND subcategory = ?';
            params.push(subcategory);
        }
        
        if (type) {
            query += ' AND type = ?';
            params.push(type);
        }
        
        if (search) {
            query += ' AND (name LIKE ? OR description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }
        
        query += ' ORDER BY created_at DESC';
        
        const [products] = await db.query(query, params);
        
        // Parse JSON fields
        const formattedProducts = products.map(product => ({
            ...product,
            number_options: product.number_options ? JSON.parse(product.number_options) : null,
            colors: product.colors ? JSON.parse(product.colors) : null,
            sizes: product.sizes ? JSON.parse(product.sizes) : null,
            description: product.description ? JSON.parse(product.description) : null,
            delivery: product.delivery ? JSON.parse(product.delivery) : null
        }));
        
        res.json({
            success: true,
            count: formattedProducts.length,
            data: formattedProducts
        });
        
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch products'
        });
    }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [products] = await db.query(
            'SELECT * FROM products WHERE product_id = ? AND is_active = true',
            [id]
        );
        
        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }
        
        const product = products[0];
        
        // Parse JSON fields
        const formattedProduct = {
            ...product,
            number_options: product.number_options ? JSON.parse(product.number_options) : null,
            colors: product.colors ? JSON.parse(product.colors) : null,
            sizes: product.sizes ? JSON.parse(product.sizes) : null,
            description: product.description ? JSON.parse(product.description) : null,
            delivery: product.delivery ? JSON.parse(product.delivery) : null
        };
        
        res.json({
            success: true,
            data: formattedProduct
        });
        
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch product'
        });
    }
};

// Get product categories
exports.getCategories = async (req, res) => {
    try {
        const [categories] = await db.query(
            'SELECT DISTINCT category FROM products WHERE is_active = true ORDER BY category'
        );
        
        res.json({
            success: true,
            data: categories.map(c => c.category)
        });
        
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch categories'
        });
    }
};

// Get subcategories by category
exports.getSubcategories = async (req, res) => {
    try {
        const { category } = req.params;
        
        const [subcategories] = await db.query(
            'SELECT DISTINCT subcategory FROM products WHERE category = ? AND is_active = true ORDER BY subcategory',
            [category]
        );
        
        res.json({
            success: true,
            data: subcategories.map(s => s.subcategory).filter(s => s)
        });
        
    } catch (error) {
        console.error('Get subcategories error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch subcategories'
        });
    }
};

// Create new product (Admin only)
exports.createProduct = async (req, res) => {
    try {
        const {
            product_id,
            name,
            category,
            subcategory,
            type,
            image,
            badge,
            standard_price,
            hifloat_price,
            price,
            foil_weight_price,
            number_options,
            colors,
            sizes,
            description,
            delivery,
            stock_quantity
        } = req.body;
        
        // Validate required fields
        if (!product_id || !name || !category || !type) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }
        
        const query = `
            INSERT INTO products (
                product_id, name, category, subcategory, type, image, badge,
                standard_price, hifloat_price, price, foil_weight_price,
                number_options, colors, sizes, description, delivery, stock_quantity
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const params = [
            product_id,
            name,
            category,
            subcategory || null,
            type,
            image || null,
            badge || null,
            standard_price || null,
            hifloat_price || null,
            price || null,
            foil_weight_price || null,
            number_options ? JSON.stringify(number_options) : null,
            colors ? JSON.stringify(colors) : null,
            sizes ? JSON.stringify(sizes) : null,
            description ? JSON.stringify(description) : null,
            delivery ? JSON.stringify(delivery) : null,
            stock_quantity || 0
        ];
        
        const [result] = await db.query(query, params);
        
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: { id: result.insertId, product_id }
        });
        
    } catch (error) {
        console.error('Create product error:', error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                error: 'Product ID already exists'
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Failed to create product'
        });
    }
};

// Update product (Admin only)
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        // Check if product exists
        const [existing] = await db.query(
            'SELECT id FROM products WHERE product_id = ?',
            [id]
        );
        
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }
        
        // Build update query dynamically
        const fields = [];
        const values = [];
        
        Object.keys(updates).forEach(key => {
            if (['number_options', 'colors', 'sizes', 'description', 'delivery'].includes(key)) {
                fields.push(`${key} = ?`);
                values.push(JSON.stringify(updates[key]));
            } else {
                fields.push(`${key} = ?`);
                values.push(updates[key]);
            }
        });
        
        if (fields.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No fields to update'
            });
        }
        
        values.push(id);
        
        const query = `UPDATE products SET ${fields.join(', ')} WHERE product_id = ?`;
        await db.query(query, values);
        
        res.json({
            success: true,
            message: 'Product updated successfully'
        });
        
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update product'
        });
    }
};

// Delete product (Admin only - soft delete)
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [result] = await db.query(
            'UPDATE products SET is_active = false WHERE product_id = ?',
            [id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
        
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete product'
        });
    }
};