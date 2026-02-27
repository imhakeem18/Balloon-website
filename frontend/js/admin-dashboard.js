// admin-dashboard.js - Dashboard functionality

// Load dashboard data
async function loadDashboardData() {
    try {
        // Load stats
        await loadStats();
        
        // Load recent orders
        await loadRecentOrders();
        
        // Load pending payments
        await loadPendingPayments();
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Load statistics
async function loadStats() {
    try {
        const response = await authenticatedFetch(`${API_URL}/orders/stats`);
        const data = await response.json();
        
        if (data.success) {
            const stats = data.stats;
            
            document.getElementById('totalOrders').textContent = stats.totalOrders || 0;
            document.getElementById('pendingOrders').textContent = stats.pendingOrders || 0;
            document.getElementById('completedOrders').textContent = stats.completedOrders || 0;
            document.getElementById('totalRevenue').textContent = `Rs. ${formatNumber(stats.totalRevenue || 0)}`;
        }
    } catch (error) {
        console.error('Error loading stats:', error);
        showError('Failed to load statistics');
    }
}

// Load recent orders
async function loadRecentOrders() {
    try {
        const response = await authenticatedFetch(`${API_URL}/orders?limit=5`);
        const data = await response.json();
        
        const tbody = document.getElementById('recentOrdersTable');
        
        if (data.success && data.orders && data.orders.length > 0) {
            tbody.innerHTML = data.orders.map(order => `
                <tr class="border-b hover:bg-gray-50 transition">
                    <td class="py-4">
                        <span class="font-mono text-sm font-semibold text-pink-600">${order.order_number}</span>
                    </td>
                    <td class="py-4">
                        <div>
                            <p class="font-medium text-gray-800">${order.customer_name}</p>
                            <p class="text-sm text-gray-500">${order.customer_email}</p>
                        </div>
                    </td>
                    <td class="py-4 text-gray-600 text-sm">
                        ${formatDate(order.created_at)}
                    </td>
                    <td class="py-4 font-semibold text-gray-800">
                        Rs. ${formatNumber(order.total_amount)}
                    </td>
                    <td class="py-4">
                        ${getStatusBadge(order.order_status)}
                    </td>
                    <td class="py-4">
                        <a href="admin-order-detail.html?id=${order.order_number}" class="text-pink-500 hover:text-pink-600 font-medium text-sm">
                            View →
                        </a>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="py-8 text-center text-gray-400">
                        No orders yet
                    </td>
                </tr>
            `;
        }
    } catch (error) {
        console.error('Error loading orders:', error);
        document.getElementById('recentOrdersTable').innerHTML = `
            <tr>
                <td colspan="6" class="py-8 text-center text-red-500">
                    Failed to load orders
                </td>
            </tr>
        `;
    }
}

// Load pending payment verifications
async function loadPendingPayments() {
    try {
        const response = await authenticatedFetch(`${API_URL}/orders?payment_status=pending`);
        const data = await response.json();
        
        const container = document.getElementById('pendingPayments');
        
        if (data.success && data.orders && data.orders.length > 0) {
            container.innerHTML = data.orders.slice(0, 3).map(order => `
                <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div class="flex items-center justify-between mb-2">
                        <span class="font-mono text-sm font-semibold text-gray-800">${order.order_number}</span>
                        <span class="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">Pending</span>
                    </div>
                    <p class="text-sm text-gray-600 mb-2">${order.customer_name}</p>
                    <div class="flex items-center justify-between">
                        <span class="font-semibold text-gray-800">Rs. ${formatNumber(order.total_amount)}</span>
                        <a href="admin-order-detail.html?id=${order.order_number}" class="text-pink-500 hover:text-pink-600 font-medium text-sm">
                            Verify →
                        </a>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = `
                <div class="text-center py-8 text-gray-400">
                    <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p>No pending verifications</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading pending payments:', error);
        document.getElementById('pendingPayments').innerHTML = `
            <div class="text-center py-8 text-red-500">
                Failed to load pending payments
            </div>
        `;
    }
}

// Helper: Get status badge
function getStatusBadge(status) {
    const badges = {
        'pending': '<span class="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">Pending</span>',
        'confirmed': '<span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Confirmed</span>',
        'processing': '<span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">Processing</span>',
        'ready': '<span class="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">Ready</span>',
        'delivered': '<span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Delivered</span>',
        'cancelled': '<span class="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Cancelled</span>'
    };
    return badges[status] || badges['pending'];
}

// Helper: Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

// Helper: Format number
function formatNumber(num) {
    return Number(num).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Helper: Show error
function showError(message) {
    console.error(message);
    // You can add a toast notification here
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadDashboardData();
    
    // Refresh data every 30 seconds
    setInterval(loadDashboardData, 30000);
});