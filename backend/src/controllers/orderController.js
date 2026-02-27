const db = require('../config/database');
const emailService = require('../utils/emailService');

// Create new order
exports.createOrder = async (req, res) => {
    try {
        const {
            customerName,
            customerEmail,
            customerPhone,
            deliveryAddress,
            deliveryCity,
            deliveryDate,
            deliveryTimeSlot,
            paymentMethod,
            items,
            subtotal,
            deliveryFee,
            totalAmount
        } = req.body;

        // Generate order number
        const orderNumber = 'ORD' + Date.now();

        // Insert order
        const [result] = await db.execute(
            `INSERT INTO orders (
                order_number, customer_name, customer_email, customer_phone,
                delivery_address, delivery_city, delivery_date, delivery_time_slot,
                payment_method, subtotal, delivery_fee, total_amount,
                order_status, payment_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending')`,
            [
                orderNumber, customerName, customerEmail, customerPhone,
                deliveryAddress, deliveryCity, deliveryDate, deliveryTimeSlot,
                paymentMethod, subtotal, deliveryFee, totalAmount
            ]
        );

        const orderId = result.insertId;

        // Insert order items
        for (const item of items) {
            await db.execute(
                `INSERT INTO order_items (
                    order_id, product_id, product_name, quantity, price, variations
                ) VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    orderId,
                    item.product_id,
                    item.product_name,
                    item.quantity,
                    item.price,
                    JSON.stringify(item.variations || {})
                ]
            );
        }

        // Send confirmation email
        // Don't send email confirmation (skip for now)
// await emailService.sendOrderConfirmation(
//     customerEmail,
//     customerName,
//     orderNumber,
//     items,
//     totalAmount
// );

console.log('✅ Order created successfully:', orderNumber);

        res.json({
            success: true,
            message: 'Order placed successfully',
            orderNumber
        });

    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create order'
        });
    }
};

// Track order
exports.trackOrder = async (req, res) => {
    try {
        const { orderNumber } = req.params;

        const [orders] = await db.execute(
            'SELECT * FROM orders WHERE order_number = ?',
            [orderNumber]
        );

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            order: orders[0]
        });

    } catch (error) {
        console.error('Track order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to track order'
        });
    }
};

// Upload payment proof
exports.uploadPaymentProof = async (req, res) => {
    try {
        const { orderNumber } = req.params;
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Get order
        const [orders] = await db.execute(
            'SELECT id FROM orders WHERE order_number = ?',
            [orderNumber]
        );

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Save payment proof
        await db.execute(
            `INSERT INTO payment_proofs (order_id, file_name, file_path, file_size)
             VALUES (?, ?, ?, ?)`,
            [orders[0].id, file.originalname, file.path, file.size]
        );

        res.json({
            success: true,
            message: 'Payment proof uploaded successfully'
        });

    } catch (error) {
        console.error('Upload payment proof error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload payment proof'
        });
    }
};

// Get order statistics (for admin dashboard)
exports.getOrderStats = async (req, res) => {
    try {
        // Total orders
        const [totalResult] = await db.execute(
            'SELECT COUNT(*) as count FROM orders'
        );
        const totalOrders = totalResult[0].count;

        // Pending orders
        const [pendingResult] = await db.execute(
            `SELECT COUNT(*) as count FROM orders 
             WHERE order_status IN ('pending', 'confirmed')`
        );
        const pendingOrders = pendingResult[0].count;

        // Completed orders
        const [completedResult] = await db.execute(
            `SELECT COUNT(*) as count FROM orders 
             WHERE order_status = 'delivered'`
        );
        const completedOrders = completedResult[0].count;

        // Total revenue
        const [revenueResult] = await db.execute(
            `SELECT SUM(total_amount) as revenue FROM orders 
             WHERE payment_status = 'paid' OR order_status = 'delivered'`
        );
        const totalRevenue = revenueResult[0].revenue || 0;

        // Orders by status
        const [statusBreakdown] = await db.execute(
            `SELECT order_status, COUNT(*) as count 
             FROM orders 
             GROUP BY order_status`
        );

        // Recent orders count (last 7 days)
        const [recentResult] = await db.execute(
            `SELECT COUNT(*) as count FROM orders 
             WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`
        );
        const recentOrders = recentResult[0].count;

        res.json({
            success: true,
            stats: {
                totalOrders,
                pendingOrders,
                completedOrders,
                totalRevenue,
                recentOrders,
                statusBreakdown
            }
        });

    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get statistics'
        });
    }
};

// Get all orders (for admin)
exports.getAllOrders = async (req, res) => {
    try {
        const { 
            status, 
            payment_status, 
            limit = 50, 
            offset = 0,
            search 
        } = req.query;

        let query = 'SELECT * FROM orders WHERE 1=1';
        let params = [];

        if (status) {
            query += ' AND order_status = ?';
            params.push(status);
        }

        if (payment_status) {
            query += ' AND payment_status = ?';
            params.push(payment_status);
        }

        if (search) {
            query += ` AND (order_number LIKE ? OR customer_name LIKE ? OR customer_email LIKE ?)`;
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [orders] = await db.execute(query, params);

        // Get total count
        let countQuery = 'SELECT COUNT(*) as total FROM orders WHERE 1=1';
        let countParams = [];

        if (status) {
            countQuery += ' AND order_status = ?';
            countParams.push(status);
        }

        if (payment_status) {
            countQuery += ' AND payment_status = ?';
            countParams.push(payment_status);
        }

        if (search) {
            countQuery += ` AND (order_number LIKE ? OR customer_name LIKE ? OR customer_email LIKE ?)`;
            const searchTerm = `%${search}%`;
            countParams.push(searchTerm, searchTerm, searchTerm);
        }

        const [countResult] = await db.execute(countQuery, countParams);
        const total = countResult[0].total;

        res.json({
            success: true,
            orders,
            pagination: {
                total,
                limit: parseInt(limit),
                offset: parseInt(offset),
                hasMore: (parseInt(offset) + orders.length) < total
            }
        });

    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get orders'
        });
    }
};

// Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderNumber } = req.params;
        const { order_status, payment_status, admin_notes } = req.body;

        // Get current order
        const [orders] = await db.execute(
            'SELECT * FROM orders WHERE order_number = ?',
            [orderNumber]
        );

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const order = orders[0];

        // Build update query
        let updates = [];
        let params = [];

        if (order_status) {
            updates.push('order_status = ?');
            params.push(order_status);
        }

        if (payment_status) {
            updates.push('payment_status = ?');
            params.push(payment_status);
        }

        if (admin_notes !== undefined) {
            updates.push('admin_notes = ?');
            params.push(admin_notes);
        }

        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No updates provided'
            });
        }

        updates.push('updated_at = NOW()');
        params.push(orderNumber);

        await db.execute(
            `UPDATE orders SET ${updates.join(', ')} WHERE order_number = ?`,
            params
        );

        // Send email notification if status changed
        if (order_status && order_status !== order.order_status) {
            await emailService.sendOrderStatusUpdate(
                order.customer_email,
                order.customer_name,
                orderNumber,
                order_status
            );
        }

        res.json({
            success: true,
            message: 'Order updated successfully'
        });

    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update order'
        });
    }
};

// Get order with items (for admin detail view)
// Get order with items (for admin detail view)
exports.getOrderWithItems = async (req, res) => {
    try {
        const { orderNumber } = req.params;
        
        // Get order
        const [orders] = await db.execute(
            'SELECT * FROM orders WHERE order_number = ?',
            [orderNumber]
        );
        
        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        const order = orders[0];
        
        // Get order items
        const [items] = await db.execute(
            'SELECT * FROM order_items WHERE order_id = ?',
            [order.id]
        );
        
        // Get payment proofs
        const [proofs] = await db.execute(
            'SELECT * FROM payment_proofs WHERE order_id = ? ORDER BY uploaded_at DESC',
            [order.id]
        );
        
        res.json({
            success: true,
            order: {
                ...order,
                items: items,
                payment_proofs: proofs
            }
        });
        
    } catch (error) {
        console.error('Get order with items error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get order details'
        });
    }

};