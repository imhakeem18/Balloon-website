// src/utils/emailService.js
const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Verify transporter
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Email service error:', error.message);
    } else {
        console.log('✅ Email service ready');
    }
});

// Send order confirmation email
exports.sendOrderConfirmation = async ({ orderNumber, customerEmail, customerName, items, total }) => {
    try {
        const itemsList = items.map(item => 
            `<li>${item.name} x ${item.quantity} - Rs. ${item.total.toLocaleString()}</li>`
        ).join('');
        
        const mailOptions = {
            from: `"Balloons Galore" <${process.env.EMAIL_USER}>`,
            to: customerEmail,
            subject: `Order Confirmation - ${orderNumber}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #ff1b8d 0%, #c86dd7 100%); padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0;">🎈 Balloons Galore</h1>
                    </div>
                    
                    <div style="padding: 30px; background: #fff;">
                        <h2 style="color: #ff1b8d;">Order Confirmed! 🎉</h2>
                        <p>Hi ${customerName},</p>
                        <p>Thank you for your order! We're getting your balloons ready.</p>
                        
                        <div style="background: #fff5f9; border-left: 4px solid #ff1b8d; padding: 15px; margin: 20px 0;">
                            <h3 style="margin: 0 0 10px 0; color: #ff1b8d;">Order Number</h3>
                            <p style="font-size: 24px; font-weight: bold; margin: 0;">${orderNumber}</p>
                        </div>
                        
                        <h3 style="color: #ff1b8d;">Order Items:</h3>
                        <ul style="list-style: none; padding: 0;">
                            ${itemsList}
                        </ul>
                        
                        <div style="border-top: 2px solid #ffe8f3; padding-top: 15px; margin-top: 15px;">
                            <p style="font-size: 18px;"><strong>Total: Rs. ${total.toLocaleString()}</strong></p>
                        </div>
                        
                        <p style="margin-top: 30px;">You can track your order using the order number above.</p>
                        
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="${process.env.FRONTEND_URL}/order-tracking.html?order=${orderNumber}" 
                               style="background: linear-gradient(135deg, #ff1b8d 0%, #c86dd7 100%); 
                                      color: white; padding: 15px 30px; text-decoration: none; 
                                      border-radius: 10px; display: inline-block; font-weight: bold;">
                                Track Your Order
                            </a>
                        </div>
                    </div>
                    
                    <div style="background: #f8f8f8; padding: 20px; text-align: center; color: #666; font-size: 12px;">
                        <p>Need help? Contact us at <a href="mailto:info@balloongalore.com">info@balloongalore.com</a></p>
                        <p>© 2025 Balloons Galore. All rights reserved.</p>
                    </div>
                </div>
            `
        };
        
        await transporter.sendMail(mailOptions);
        console.log('✅ Order confirmation email sent to:', customerEmail);
        
    } catch (error) {
        console.error('❌ Email send error:', error.message);
        throw error;
    }
};

// Send order status update email
exports.sendOrderStatusUpdate = async ({ orderNumber, customerEmail, customerName, status }) => {
    try {
        const statusMessages = {
            confirmed: 'Your order has been confirmed and is being prepared!',
            processing: 'We\'re preparing your order with care!',
            shipped: 'Your order is on its way to you!',
            delivered: 'Your order has been delivered. Enjoy your balloons! 🎈',
            cancelled: 'Your order has been cancelled.'
        };
        
        const statusEmojis = {
            confirmed: '✅',
            processing: '📦',
            shipped: '🚚',
            delivered: '🎉',
            cancelled: '❌'
        };
        
        const mailOptions = {
            from: `"Balloons Galore" <${process.env.EMAIL_USER}>`,
            to: customerEmail,
            subject: `Order Update - ${orderNumber}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #ff1b8d 0%, #c86dd7 100%); padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0;">🎈 Balloons Galore</h1>
                    </div>
                    
                    <div style="padding: 30px; background: #fff;">
                        <h2 style="color: #ff1b8d;">Order Status Update ${statusEmojis[status] || '📦'}</h2>
                        <p>Hi ${customerName},</p>
                        <p>${statusMessages[status] || 'Your order status has been updated.'}</p>
                        
                        <div style="background: #fff5f9; border-left: 4px solid #ff1b8d; padding: 15px; margin: 20px 0;">
                            <h3 style="margin: 0 0 10px 0; color: #ff1b8d;">Order Number</h3>
                            <p style="font-size: 24px; font-weight: bold; margin: 0;">${orderNumber}</p>
                            <p style="margin: 10px 0 0 0;"><strong>Status:</strong> ${status.charAt(0).toUpperCase() + status.slice(1)}</p>
                        </div>
                        
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="${process.env.FRONTEND_URL}/order-tracking.html?order=${orderNumber}" 
                               style="background: linear-gradient(135deg, #ff1b8d 0%, #c86dd7 100%); 
                                      color: white; padding: 15px 30px; text-decoration: none; 
                                      border-radius: 10px; display: inline-block; font-weight: bold;">
                                Track Your Order
                            </a>
                        </div>
                    </div>
                    
                    <div style="background: #f8f8f8; padding: 20px; text-align: center; color: #666; font-size: 12px;">
                        <p>Need help? Contact us at <a href="mailto:info@balloongalore.com">info@balloongalore.com</a></p>
                        <p>© 2025 Balloons Galore. All rights reserved.</p>
                    </div>
                </div>
            `
        };
        
        await transporter.sendMail(mailOptions);
        console.log('✅ Status update email sent to:', customerEmail);
        
    } catch (error) {
        console.error('❌ Email send error:', error.message);
        throw error;
    }
};

// Send payment verification email (Admin)
exports.sendPaymentVerificationNotification = async (orderNumber) => {
    try {
        const mailOptions = {
            from: `"Balloons Galore" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Send to admin
            subject: `Payment Proof Uploaded - ${orderNumber}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #ff1b8d;">Payment Proof Uploaded</h2>
                    <p>A customer has uploaded a payment proof for order: <strong>${orderNumber}</strong></p>
                    <p>Please verify the payment and update the order status.</p>
                    <p><a href="${process.env.FRONTEND_URL}/admin/orders">View in Admin Panel</a></p>
                </div>
            `
        };
        
        await transporter.sendMail(mailOptions);
        console.log('✅ Admin notification sent for order:', orderNumber);
        
    } catch (error) {
        console.error('❌ Admin notification error:', error.message);
    }
};