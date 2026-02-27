// js/admin-orders.js
let currentPage = 0;
const ordersPerPage = 20;
let currentFilters = {
    status: '',
    payment_status: '',
    search: ''
};

// Load orders
async function loadOrders() {
    try {
        const params = new URLSearchParams({
            limit: ordersPerPage,
            offset: currentPage * ordersPerPage,
            ...currentFilters
        });
        
        // Remove empty filters
        for (let [key, value] of params.entries()) {
            if (!value) params.delete(key);
        }
        
        const response = await authenticatedFetch(`${API_URL}/orders?${params}`);
        const data = await response.json();
        
        if (data.success) {
            displayOrders(data.orders);
            updatePagination(data.pagination);
        }
    } catch (error) {
        console.error('Error loading orders:', error);
        showError('Failed to load orders');
    }
}

// Display orders in table
function displayOrders(orders) {
    const tbody = document.getElementById('ordersTableBody');
    
    if (!orders || orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-12 text-center text-gray-400">
                    <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                    </svg>
                    <p class="text-lg font-medium">No orders found</p>
                    <p class="text-sm mt-1">Try adjusting your filters</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = orders.map(order => `
        <tr class="border-b hover:bg-gray-50 transition">
            <td class="px-6 py-4">
                <span class="font-mono text-sm font-semibold text-pink-600">${order.order_number}</span>
            </td>
            <td class="px-6 py-4">
                <div>
                    <p class="font-medium text-gray-800">${escapeHtml(order.customer_name)}</p>
                    <p class="text-sm text-gray-500">${escapeHtml(order.customer_email)}</p>
                    <p class="text-xs text-gray-400">${escapeHtml(order.customer_phone)}</p>
                </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">
                ${formatDate(order.created_at)}
            </td>
            <td class="px-6 py-4 font-semibold text-gray-800">
                Rs. ${formatNumber(order.total_amount)}
            </td>
            <td class="px-6 py-4">
                ${getPaymentBadge(order.payment_status)}
            </td>
            <td class="px-6 py-4">
                ${getStatusBadge(order.order_status)}
            </td>
            <td class="px-6 py-4">
                <a href="admin-order-detail.html?id=${order.order_number}" 
                   class="inline-flex items-center px-3 py-1 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-sm font-medium transition">
                    View
                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </a>
            </td>
        </tr>
    `).join('');
}

// Update pagination
function updatePagination(pagination) {
    const info = document.getElementById('paginationInfo');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    const start = pagination.offset + 1;
    const end = Math.min(pagination.offset + pagination.limit, pagination.total);
    
    info.textContent = `Showing ${start}-${end} of ${pagination.total} orders`;
    
    prevBtn.disabled = pagination.offset === 0;
    nextBtn.disabled = !pagination.hasMore;
}

// Navigation
function previousPage() {
    if (currentPage > 0) {
        currentPage--;
        loadOrders();
    }
}

function nextPage() {
    currentPage++;
    loadOrders();
}

// Filter handlers
document.addEventListener('DOMContentLoaded', () => {
    loadOrders();
    
    // Search input with debounce
    let searchTimeout;
    document.getElementById('searchInput').addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            currentFilters.search = e.target.value;
            currentPage = 0;
            loadOrders();
        }, 500);
    });
    
    // Status filter
    document.getElementById('statusFilter').addEventListener('change', (e) => {
        currentFilters.status = e.target.value;
        currentPage = 0;
        loadOrders();
    });
    
    // Payment filter
    document.getElementById('paymentFilter').addEventListener('change', (e) => {
        currentFilters.payment_status = e.target.value;
        currentPage = 0;
        loadOrders();
    });
});

// Helper: Get payment badge
function getPaymentBadge(status) {
    const badges = {
        'pending': '<span class="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">Pending</span>',
        'paid': '<span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Paid</span>',
        'failed': '<span class="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Failed</span>'
    };
    return badges[status] || badges['pending'];
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
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Helper: Format number
function formatNumber(num) {
    return Number(num).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Helper: Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Helper: Show error
function showError(message) {
    // You can implement a toast notification here
    alert(message);
}