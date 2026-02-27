// js/admin-order-detail.js
let currentOrder = null;

// Get order ID from URL
function getOrderId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Load order details
async function loadOrderDetails() {
    try {
        const orderId = getOrderId();
        if (!orderId) {
            throw new Error('No order ID provided');
        }
        
        const response = await authenticatedFetch(`${API_URL}/orders/${orderId}/details`);
        const data = await response.json();
        
        if (data.success) {
            currentOrder = data.order;
            displayOrderDetails(currentOrder);
            document.getElementById('loadingState').classList.add('hidden');
            document.getElementById('orderContent').classList.remove('hidden');
        } else {
            throw new Error(data.message || 'Failed to load order');
        }
    } catch (error) {
        console.error('Error loading order:', error);
        document.getElementById('loadingState').innerHTML = `
            <div class="text-center py-12">
                <svg class="w-16 h-16 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="text-red-600 font-medium mb-2">Failed to load order details</p>
                <p class="text-gray-500 text-sm mb-4">${error.message}</p>
                <a href="admin-orders.html" class="text-pink-500 hover:text-pink-600 font-medium">← Back to Orders</a>
            </div>
        `;
    }
}

// Display order details
function displayOrderDetails(order) {
    // Header
    document.getElementById('orderNumber').textContent = order.order_number;
    document.getElementById('orderDate').textContent = formatDate(order.created_at);
    document.getElementById('paymentStatusBadge').innerHTML = getPaymentBadge(order.payment_status, true);
    document.getElementById('orderStatusBadge').innerHTML = getStatusBadge(order.order_status, true);
    
    // Set current status in dropdowns
    document.getElementById('newOrderStatus').value = order.order_status;
    document.getElementById('newPaymentStatus').value = order.payment_status;
    
    // Customer info
    document.getElementById('customerName').textContent = order.customer_name;
    document.getElementById('customerEmail').textContent = order.customer_email;
    document.getElementById('customerPhone').textContent = order.customer_phone;
    
    // Delivery info
    document.getElementById('deliveryDate').textContent = order.delivery_date ? formatDate(order.delivery_date, false) : 'Not specified';
    document.getElementById('timeSlot').textContent = order.delivery_time_slot || 'Not specified';
    document.getElementById('deliveryAddress').textContent = order.delivery_address;
    document.getElementById('deliveryCity').textContent = order.delivery_city;
    
    // Payment info
    document.getElementById('paymentMethod').textContent = formatPaymentMethod(order.payment_method);
    
    // Admin notes
    document.getElementById('adminNotes').value = order.admin_notes || '';
    
    // Order items
    displayOrderItems(order.items);
    
    // Totals
    document.getElementById('subtotal').textContent = `Rs. ${formatNumber(order.subtotal)}`;
    document.getElementById('deliveryFee').textContent = `Rs. ${formatNumber(order.delivery_fee)}`;
    document.getElementById('totalAmount').textContent = `Rs. ${formatNumber(order.total_amount)}`;
    
    // Payment proofs
    displayPaymentProofs(order.payment_proofs);
}

// Display order items
function displayOrderItems(items) {
    const container = document.getElementById('orderItems');
    
    if (!items || items.length === 0) {
        container.innerHTML = '<p class="text-gray-400 text-center py-4">No items in this order</p>';
        return;
    }
    
    container.innerHTML = items.map(item => `
        <div class="border border-gray-200 rounded-lg p-4">
            <div class="flex justify-between items-start mb-2">
                <div class="flex-1">
                    <h4 class="font-semibold text-gray-800">${escapeHtml(item.product_name)}</h4>
                    <p class="text-sm text-gray-500">Product ID: ${item.product_id}</p>
                </div>
                <div class="text-right">
                    <p class="font-semibold text-gray-800">Rs. ${formatNumber(item.price)}</p>
                    <p class="text-sm text-gray-500">Qty: ${item.quantity}</p>
                </div>
            </div>
            ${item.variations ? displayVariations(item.variations) : ''}
        </div>
    `).join('');
}

// Display variations
function displayVariations(variationsStr) {
    try {
        const variations = typeof variationsStr === 'string' ? JSON.parse(variationsStr) : variationsStr;
        
        if (!variations || Object.keys(variations).length === 0) {
            return '';
        }
        
        return `
            <div class="mt-3 pt-3 border-t border-gray-200">
                <p class="text-sm font-medium text-gray-600 mb-2">Customizations:</p>
                <div class="grid grid-cols-2 gap-2 text-sm">
                    ${Object.entries(variations).map(([key, value]) => `
                        <div>
                            <span class="text-gray-500">${formatVariationKey(key)}:</span>
                            <span class="text-gray-800 font-medium ml-1">${formatVariationValue(value)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } catch (e) {
        console.error('Error parsing variations:', e);
        return '';
    }
}

// Display payment proofs
function displayPaymentProofs(proofs) {
    const container = document.getElementById('paymentProofs');
    
    if (!proofs || proofs.length === 0) {
        container.innerHTML = '<p class="text-gray-400 text-center py-4">No payment proofs uploaded</p>';
        return;
    }
    
    container.innerHTML = proofs.map(proof => `
        <div class="border border-gray-200 rounded-lg p-4 mb-3">
            <div class="flex items-center justify-between mb-3">
                <div>
                    <p class="font-medium text-gray-800">${escapeHtml(proof.file_name)}</p>
                    <p class="text-sm text-gray-500">Uploaded: ${formatDate(proof.uploaded_at)}</p>
                </div>
                ${getVerificationBadge(proof.verification_status)}
            </div>
            <a href="http://localhost:5000/${proof.file_path}" 
               target="_blank" 
               class="inline-flex items-center text-pink-500 hover:text-pink-600 font-medium text-sm">
                View Payment Proof →
            </a>
        </div>
    `).join('');
}

// Update order status
async function updateOrderStatus() {
    try {
        const newOrderStatus = document.getElementById('newOrderStatus').value;
        const newPaymentStatus = document.getElementById('newPaymentStatus').value;
        
        if (newOrderStatus === currentOrder.order_status && 
            newPaymentStatus === currentOrder.payment_status) {
            alert('No changes to update');
            return;
        }
        
        if (!confirm('Are you sure you want to update this order status?')) {
            return;
        }
        
        const response = await authenticatedFetch(
            `${API_URL}/orders/${currentOrder.order_number}/status`,
            {
                method: 'PATCH',
                body: JSON.stringify({
                    order_status: newOrderStatus,
                    payment_status: newPaymentStatus
                })
            }
        );
        
        const data = await response.json();
        
        if (data.success) {
            alert('Order status updated successfully!');
            // Reload order details
            loadOrderDetails();
        } else {
            throw new Error(data.message || 'Failed to update order');
        }
    } catch (error) {
        console.error('Error updating status:', error);
        alert('Failed to update order status: ' + error.message);
    }
}

// Save admin notes
async function saveAdminNotes() {
    try {
        const notes = document.getElementById('adminNotes').value;
        
        const response = await authenticatedFetch(
            `${API_URL}/orders/${currentOrder.order_number}/status`,
            {
                method: 'PATCH',
                body: JSON.stringify({ admin_notes: notes })
            }
        );
        
        const data = await response.json();
        
        if (data.success) {
            alert('Notes saved successfully!');
        } else {
            throw new Error(data.message || 'Failed to save notes');
        }
    } catch (error) {
        console.error('Error saving notes:', error);
        alert('Failed to save notes: ' + error.message);
    }
}

// Helper functions
function getPaymentBadge(status, large = false) {
    const size = large ? 'px-4 py-2 text-sm' : 'px-3 py-1 text-xs';
    const badges = {
        'pending': `<span class="${size} bg-yellow-100 text-yellow-700 rounded-full font-semibold">Payment Pending</span>`,
        'paid': `<span class="${size} bg-green-100 text-green-700 rounded-full font-semibold">Paid</span>`,
        'failed': `<span class="${size} bg-red-100 text-red-700 rounded-full font-semibold">Payment Failed</span>`
    };
    return badges[status] || badges['pending'];
}

function getStatusBadge(status, large = false) {
    const size = large ? 'px-4 py-2 text-sm' : 'px-3 py-1 text-xs';
    const badges = {
        'pending': `<span class="${size} bg-yellow-100 text-yellow-700 rounded-full font-semibold">Pending</span>`,
        'confirmed': `<span class="${size} bg-blue-100 text-blue-700 rounded-full font-semibold">Confirmed</span>`,
        'processing': `<span class="${size} bg-purple-100 text-purple-700 rounded-full font-semibold">Processing</span>`,
        'ready': `<span class="${size} bg-indigo-100 text-indigo-700 rounded-full font-semibold">Ready</span>`,
        'delivered': `<span class="${size} bg-green-100 text-green-700 rounded-full font-semibold">Delivered</span>`,
        'cancelled': `<span class="${size} bg-red-100 text-red-700 rounded-full font-semibold">Cancelled</span>`
    };
    return badges[status] || badges['pending'];
}

function getVerificationBadge(status) {
    const badges = {
        'pending': '<span class="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">Pending Verification</span>',
        'verified': '<span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Verified</span>',
        'rejected': '<span class="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Rejected</span>'
    };
    return badges[status] || badges['pending'];
}

function formatPaymentMethod(method) {
    const methods = {
        'bank_transfer': 'Bank Transfer',
        'card': 'Credit/Debit Card',
        'cash': 'Cash on Delivery'
    };
    return methods[method] || method;
}

function formatVariationKey(key) {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function formatVariationValue(value) {
    if (Array.isArray(value)) {
        return value.join(', ');
    }
    return value;
}

function formatDate(dateString, includeTime = true) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
    };
    
    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
    }
    
    return date.toLocaleDateString('en-US', options);
}

function formatNumber(num) {
    return Number(num).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Load order on page load
document.addEventListener('DOMContentLoaded', () => {
    loadOrderDetails();
});