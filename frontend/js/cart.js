// frontend/js/cart.js - Shopping Cart System

class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
    }

    // Load cart from localStorage
    loadCart() {
        const saved = localStorage.getItem('balloons_cart');
        return saved ? JSON.parse(saved) : [];
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('balloons_cart', JSON.stringify(this.items));
        this.updateCartBadge();
    }

    // Add item to cart
    addItem(product, quantity = 1, variations = {}) {
        const existingIndex = this.items.findIndex(item => 
            item.id === product.id && 
            JSON.stringify(item.variations) === JSON.stringify(variations)
        );

        if (existingIndex > -1) {
            // Item already exists, increase quantity
            this.items[existingIndex].quantity += quantity;
        } else {
            // Add new item
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price || product.prices?.standard || 0,
                quantity: quantity,
                image: product.image,
                variations: variations
            });
        }

        this.saveCart();
        this.showAddedNotification(product.name);
    }

    // Remove item from cart
    removeItem(index) {
        this.items.splice(index, 1);
        this.saveCart();
    }

    // Update item quantity
    updateQuantity(index, quantity) {
        if (quantity <= 0) {
            this.removeItem(index);
        } else {
            this.items[index].quantity = quantity;
            this.saveCart();
        }
    }

    // Get cart items
    getItems() {
        return this.items;
    }

    // Get cart count
    getCount() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Get cart total
    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Clear cart
    clear() {
        this.items = [];
        this.saveCart();
    }

    // Update cart badge in navigation
    updateCartBadge() {
        const badges = document.querySelectorAll('.cart-badge');
        const count = this.getCount();
        
        badges.forEach(badge => {
            if (count > 0) {
                badge.textContent = count;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        });
    }

    // Show notification when item added
    showAddedNotification(productName) {
        // Remove existing notification if any
        const existing = document.querySelector('.cart-notification');
        if (existing) existing.remove();

        // Create notification
        const notification = document.createElement('div');
        notification.className = 'cart-notification fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-3 animate-slide-in';
        notification.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>${productName} added to cart!</span>
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize cart
const cart = new ShoppingCart();

// Update badge on page load
document.addEventListener('DOMContentLoaded', () => {
    cart.updateCartBadge();
});

// Export for use in other files
window.cart = cart;