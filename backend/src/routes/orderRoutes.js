const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes (no auth required)
router.post('/', orderController.createOrder);
router.get('/track/:orderNumber', orderController.trackOrder);
router.post('/:orderNumber/payment-proof', upload.single('payment_proof'), orderController.uploadPaymentProof);

// Admin routes (auth required)
router.get('/stats', verifyToken, orderController.getOrderStats);
router.get('/:orderNumber/details', verifyToken, orderController.getOrderWithItems);
router.patch('/:orderNumber/status', verifyToken, orderController.updateOrderStatus);

// This must be LAST because it matches everything
router.get('/', verifyToken, orderController.getAllOrders);

module.exports = router;