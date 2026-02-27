
// frontend/js/admin-auth.js - Authentication utilities for admin panel
const API_URL = 'http://localhost:5000/api';

// Check if user is authenticated
function checkAuth() {
    const token = getToken();
    if (!token) {
        window.location.href = 'admin-login.html';
        return false;
    }
    return true;
}

// Get token from storage
function getToken() {
    return localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
}

// Get user from storage
function getUser() {
    const userStr = localStorage.getItem('adminUser') || sessionStorage.getItem('adminUser');
    return userStr ? JSON.parse(userStr) : null;
}

// API request helper with auth
async function authenticatedFetch(url, options = {}) {
    const token = getToken();
    
    if (!token) {
        window.location.href = 'admin-login.html';
        throw new Error('Not authenticated');
    }
    
    const headers = options.headers || {};
    headers['Authorization'] = `Bearer ${token}`;
    
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }
    
    const response = await fetch(url, {
        ...options,
        headers
    });
    
    // If unauthorized, redirect to login
    if (response.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        sessionStorage.removeItem('adminToken');
        sessionStorage.removeItem('adminUser');
        window.location.href = 'admin-login.html';
        throw new Error('Session expired');
    }
    
    return response;
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        sessionStorage.removeItem('adminToken');
        sessionStorage.removeItem('adminUser');
        window.location.href = 'admin-login.html';
    }
}

// Toggle sidebar on mobile
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('-translate-x-full');
}

// Initialize user info on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check auth (except on login page)
    if (!window.location.pathname.includes('admin-login.html')) {
        checkAuth();
        
        // Load user info
        const user = getUser();
        if (user) {
            const nameEl = document.getElementById('adminName');
            const emailEl = document.getElementById('adminEmail');
            
            if (nameEl) nameEl.textContent = user.username || 'Admin';
            if (emailEl) emailEl.textContent = user.email || '';
        }
    }
});