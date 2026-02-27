// js/decor-services.js

// WhatsApp Number
const WHATSAPP_NUMBER = '+94777034347';

// Available Colors (Default set - used if product doesn't specify custom colors)
const DEFAULT_COLORS = [
    { name: 'Pink', hex: '#FF69B4' },
    { name: 'Blue', hex: '#4169E1' },
    { name: 'Gold', hex: '#FFD700' },
    { name: 'Silver', hex: '#C0C0C0' },
    { name: 'Rose Gold', hex: '#B76E79' },
    { name: 'Purple', hex: '#9370DB' },
    { name: 'Red', hex: '#DC143C' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Black', hex: '#000000' },
    { name: 'Green', hex: '#32CD32' },
    { name: 'Yellow', hex: '#FFD700' },
    { name: 'Orange', hex: '#FF8C00' }
];

// Keep for backward compatibility
const AVAILABLE_COLORS = DEFAULT_COLORS;

// Decor Services Database
const decorServices = {
    // ============================================
    // BACKDROPS & ARCHES
    // ============================================
    'entrance-arch': {
        id: 'entrance-arch',
        name: 'Entrance Arch',
        category: 'balloon-decor',
        subcategory: 'backdrops-arches',
        image: 'images/arch/arch-1.jpeg',
        description: 'Deluxe Balloon Entrance Setup – Perfect for Any Celebration',
        features: 'Designed for entrances, photo backdrops, or event welcomes. Perfect for birthdays, weddings, corporate events, and more.',
        pricing: 'WhatsApp for more info',
        themes: ['Pastel', 'Matt', 'Metallic'] // Custom themes for this product
    },


    
    // ============================================
    // ORGANIC BALLOONS
    // ============================================
    'organic-balloon-garland': {
        id: 'organic-balloon-garland',
        name: 'Organic Balloon Garland On Stand (Max 6ft)',
        category: 'balloon-decor',
        subcategory: 'organic-balloons',
        image: 'images/organic/b-stand-6.jpeg',
        description: 'Bring any space to life with our stunning air-filled organic balloon garland, beautifully arranged on a stand for easy setup and delivery. Perfect for birthdays, baby showers, corporate events, or any celebration that needs a stylish touch.',
        features: 'Made with premium quality air-filled balloons (no helium), Comes securely arranged on a sturdy stand — ready to display, Fully customizable in up to 3 colors to match your theme, Ideal for doorways, dessert tables, or photo corners, Suitable for both indoor and outdoor setups',
        pricing: 'WhatsApp for more info',
        hasTheme: false 
       
    },          



       'organic-balloon-garland-anytheme': {
        id: 'organic-balloon-garland-anytheme',
        name: 'Organic Balloon Garland Any Theme',
        category: 'balloon-decor',
        subcategory: 'organic-balloons',
        image: 'images/organic/any-theme-organic.jpeg',
        description: 'Bring any space to life with our stunning air-filled organic balloon garland, beautifully arranged on a stand for easy setup and delivery. Perfect for birthdays, baby showers, corporate events, or any celebration that needs a stylish touch.',
        features: 'Made with premium quality air-filled balloons (no helium), Comes securely arranged on a sturdy stand — ready to display, Fully customizable in up to 3 colors to match your theme, Ideal for doorways, dessert tables, or photo corners, Suitable for both indoor and outdoor setups',
        pricing: 'WhatsApp for more info',
        hasTheme: false 
       
    },
  
    // Daisy Theme Product with CUSTOM COLORS
    'daisy-balloon-stand': {
        id: 'daisy-balloon-stand',
        name: 'Organic Balloon Stand - Daisy Theme',
        category: 'balloon-decor',
        subcategory: 'organic-balloons',
        image: 'images/organic/daisy-theme-stand.jpeg',
        description: '🌼 Daisy Theme Organic Balloon Garland – 6ft',
        features: 'Add a soft, cheerful touch to your celebration with our 6ft Daisy Theme Organic Balloon Garland, perfect for birthdays, baby showers, or garden-style events. 6ft air-filled organic garland on a stand. Customizable in up to 3 balloon colors. Choose your daisy flower colors to match your theme. Available for delivery or pickup within Colombo. Cake pillar and stand rental available upon special request. Perfect for dessert tables, backdrops, or entrance displays!',
        pricing: 'Rs. 13,000',
        themes: ['Daisy White & Yellow', 'Daisy Pink Mauve', 'Daisy Sandwhite', 'Daisy Blue', 'Daisy Green'],
        // CUSTOM COLORS for this product only
        customColors: [
            { name: 'White', hex: '#FFFFFF' },
            { name: 'Yellow', hex: '#FFD700' },
            { name: 'Pink Mauve', hex: '#D8B5C8' },
            { name: 'Sandwhite', hex: '#F5E6D3' },
            { name: 'Daisy Blue', hex: '#B8D8E8' },
            { name: 'Daisy Green', hex: '#A8D5BA' },
            { name: 'Coral', hex: '#FF7F7F' },
            { name: 'Lavender', hex: '#E6E6FA' }
        ]
    }
,
    
    'organic-balloon-any-number': {
    id: 'organic-balloon-any-number',
    name: 'Organic Balloon Garland - Any Number',
    category: 'balloon-decor',
    subcategory: 'organic-balloons',
    image: 'images/organic/organic-any-theme-new.jpeg',
    description: 'Create your perfect celebration setup with our custom organic balloon garland, designed to match any number and colors you choose! Ideal for birthdays and special occasions.',
    features: 'Air-filled organic garland on a stand • Choose up to 4 balloon colors • Includes 2-digit number foil balloons • 6 feet height max • Suitable for both indoor and outdoor setups • Available for delivery or pickup within Colombo',
    pricing: 'Rs. 14,000/-',
    maxColors: 4,
     themes: ['Daisy White & Yellow', 'Daisy Pink Mauve', 'Daisy Sandwhite', 'Daisy Blue', 'Daisy Green'],
    hasNumberVariation: true, // Add this flag
    numberDigits: 2 // Maximum digits allowed
},


    
    // ============================================
    // ADD MORE PRODUCTS HERE
    // ============================================
    
    /*
    'your-product-id': {
        id: 'your-product-id',
        name: 'Your Product Name',
        category: 'balloon-decor',
        subcategory: 'backdrops-arches',  // or 'organic-balloons'
        image: 'images/decor/your-image.jpg',
        description: 'Short catchy description',
        features: 'Detailed features and what is included',
        pricing: 'WhatsApp for more info',
        themes: ['Pastel', 'Matt', 'Metallic', 'Custom1', 'Custom2'] // Your custom themes
    },
    */
};

// State
let selectedService = null;
let selectedColors = [];
let selectedTheme = null;

// Mobile Menu
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const closeMobileMenu = document.getElementById('closeMobileMenu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
});

closeMobileMenu.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    document.body.style.overflow = 'auto';
});

mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
        mobileMenu.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
});

// Current filters
let currentCategory = 'all';
let currentSubcategory = 'all';

// Filter Services
function filterServices() {
    let filtered = Object.values(decorServices);
    
    // Filter by category
    if (currentCategory !== 'all') {
        filtered = filtered.filter(service => service.category === currentCategory);
    }
    
    // Filter by subcategory
    if (currentSubcategory !== 'all') {
        filtered = filtered.filter(service => service.subcategory === currentSubcategory);
    }
    
    displayServices(filtered);
    
    // Show/hide subcategory buttons - ONLY show when Balloon Decor is selected
    const subcategoryButtons = document.getElementById('subcategoryButtons');
    if (currentCategory === 'balloon-decor') {
        subcategoryButtons.classList.remove('hidden');
        subcategoryButtons.classList.add('flex'); // Make it flex to center items
    } else {
        subcategoryButtons.classList.add('hidden');
        subcategoryButtons.classList.remove('flex');
    }
}

// Display Services
function displayServices(services) {
    const grid = document.getElementById('productsGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (services.length === 0) {
        grid.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }
    
    grid.classList.remove('hidden');
    emptyState.classList.add('hidden');
    
    grid.innerHTML = services.map(service => `
        <div class="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer animate-fadeIn" onclick="openServiceModal('${service.id}')">
            <div class="relative h-64 bg-cover bg-center" style="background-image: url('${service.image}'); background-color: #ffe8f3;">
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            <div class="p-4 sm:p-6">
                <h3 class="text-xl font-black mb-2 text-text-light dark:text-text-dark">${service.name}</h3>
                <p class="text-sm text-subtext-light dark:text-subtext-dark mb-3 line-clamp-2">${service.description}</p>
                <div class="flex items-center justify-between">
                    <span class="text-primary font-bold text-sm">💬 ${service.pricing}</span>
                    <button class="bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-xl font-semibold hover:scale-105 transition-all text-sm">
                        Get Quote
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Open Service Modal
function openServiceModal(serviceId) {
    selectedService = decorServices[serviceId];
    if (!selectedService) return;
    
    // Reset selections
    selectedColors = [];
    selectedTheme = null;
    
    // Populate modal
    document.getElementById('modalTitle').textContent = selectedService.name;
    document.getElementById('modalImage').src = selectedService.image;
    document.getElementById('modalDescription').textContent = selectedService.description;
    document.getElementById('modalFeatures').textContent = selectedService.features;
    
    // Populate color options - Use custom colors if available, otherwise use default
    const colorOptions = document.getElementById('colorOptions');
    const colorsToShow = selectedService.customColors || DEFAULT_COLORS;
    
    colorOptions.innerHTML = colorsToShow.map(color => `
        <div class="color-option flex flex-col items-center gap-2" data-color="${color.name}">
            <div class="w-12 h-12 rounded-full border-2 border-gray-300" style="background-color: ${color.hex};"></div>
            <span class="text-xs font-semibold">${color.name}</span>
        </div>
    `).join('');
    

// Show/hide theme selection based on product
const themeSection = document.querySelector('.mb-6:has(#themeOptions)'); // Find the theme section div
const themeOptions = document.getElementById('themeOptions');

if (selectedService.hasTheme === false) {
    // Hide theme section if product doesn't need it
    if (themeSection) themeSection.style.display = 'none';
} else {
    // Show theme section and populate options
    if (themeSection) themeSection.style.display = 'block';
    
    const themes = selectedService.themes || ['Pastel', 'Matt', 'Metallic'];
    
    themeOptions.innerHTML = themes.map(theme => `
        <div class="theme-option border-2 border-gray-300 rounded-xl p-4 text-center" data-theme="${theme.toLowerCase().replace(/\s+/g, '-')}">
            <p class="font-bold">${theme}</p>
        </div>
    `).join('');
    
    // Update grid columns based on number of themes
    if (themes.length === 2) {
        themeOptions.className = 'grid grid-cols-2 gap-3';
    } else if (themes.length === 3) {
        themeOptions.className = 'grid grid-cols-3 gap-3';
    } else if (themes.length === 4) {
        themeOptions.className = 'grid grid-cols-2 sm:grid-cols-4 gap-3';
    } else {
        themeOptions.className = 'grid grid-cols-2 sm:grid-cols-3 gap-3';
    }
}

    
  
    
    // Update selected colors display
    updateSelectedColorsDisplay();
    



    // Update color limit text - ADD THIS
const maxColors = selectedService.maxColors || 3;
document.getElementById('colorLimitText').textContent = `(Choose up to ${maxColors} color${maxColors > 1 ? 's' : ''})`;

// Show/hide number selection based on product - ADD THIS
const numberSection = document.getElementById('numberSelectionSection');
const balloonNumberInput = document.getElementById('balloonNumber');

if (selectedService.hasNumberVariation) {
    numberSection.style.display = 'block';
    balloonNumberInput.value = ''; // Reset
} else {
    numberSection.style.display = 'none';
}

    
    // Show modal
    document.getElementById('serviceModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Close Modal
document.getElementById('closeModal').addEventListener('click', closeServiceModal);
document.getElementById('serviceModal').addEventListener('click', (e) => {
    if (e.target.id === 'serviceModal') {
        closeServiceModal();
    }
});

function closeServiceModal() {
    document.getElementById('serviceModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Color Selection
document.getElementById('colorOptions').addEventListener('click', (e) => {
    const colorOption = e.target.closest('.color-option');
    if (!colorOption) return;
    
    const colorName = colorOption.getAttribute('data-color');
    
    if (selectedColors.includes(colorName)) {
        // Remove color
        selectedColors = selectedColors.filter(c => c !== colorName);
        colorOption.classList.remove('selected');
    } else {
        // Add color (max 3)
        if (selectedColors.length >= 3) {
            alert('You can select maximum 3 colors');
            return;
        }
        selectedColors.push(colorName);
        colorOption.classList.add('selected');
    }
    
    updateSelectedColorsDisplay();
});

// Add Custom Color
document.getElementById('addCustomColor').addEventListener('click', () => {
    const customColor = document.getElementById('customColor').value.trim();
    
    if (!customColor) return;
    
    if (selectedColors.length >= 3) {
        alert('You can select maximum 3 colors');
        return;
    }
    
    if (selectedColors.includes(customColor)) {
        alert('Color already added');
        return;
    }
    
    selectedColors.push(customColor);
    document.getElementById('customColor').value = '';
    updateSelectedColorsDisplay();
});

function updateSelectedColorsDisplay() {
    const display = document.getElementById('selectedColors');
    display.textContent = selectedColors.length > 0 ? selectedColors.join(', ') : 'None';
}

// Theme Selection
document.getElementById('themeOptions').addEventListener('click', (e) => {
    const themeOption = e.target.closest('.theme-option');
    if (!themeOption) return;
    
    // Remove previous selection
    document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('selected'));
    
    // Select new theme
    themeOption.classList.add('selected');
    selectedTheme = themeOption.getAttribute('data-theme');
});

// Request Quote
document.getElementById('requestQuoteBtn').addEventListener('click', () => {
    // Validate selections

    // Validate theme only if required
if (selectedService.hasTheme !== false && !selectedTheme) {
    alert('Please select a theme');
    return;
}


    if (selectedColors.length < 2) {
        alert('Please select at least 2 colors');
        return;
    }
    
    if (!selectedTheme) {
        alert('Please select a theme');
        return;
    }

    const eventDate = document.getElementById('eventDate').value;
    const eventTime = document.getElementById('eventTime').value;
    const eventVenue = document.getElementById('eventVenue').value.trim();

    if (!eventDate) {
        alert('Please enter the event date');
        return;
    }

    if (!eventVenue) {
        alert('Please enter the venue/location');
        return;
    }
    
    // Format date
    const dateObj = new Date(eventDate);
    const formattedDate = dateObj.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    // Build WhatsApp message
   let message = `Hi! I'm interested in the *${selectedService.name}*\n\n` +
               `🎨 *Colors:* ${selectedColors.join(', ')}\n`;

if (balloonNumber !== null) {
    message += `🔢 *Number:* ${balloonNumber.padStart(2, '0')}\n`;
}

// Only add theme if product has theme selection
if (selectedService.hasTheme !== false && selectedTheme) {
    message += `✨ *Theme:* ${selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)}\n`;
}

message += `📅 *Event Date:* ${formattedDate}`;
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Category button handlers
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (this.disabled) return;
            
            console.log('Category clicked:', this.getAttribute('data-category'));
            
            // Update active state
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update filter
            currentCategory = this.getAttribute('data-category');
            currentSubcategory = 'all'; // Reset subcategory
            
            // Update subcategory buttons
            document.querySelectorAll('.subcategory-btn').forEach(b => b.classList.remove('active'));
            const allSubBtn = document.querySelector('.subcategory-btn[data-subcategory="all"]');
            if (allSubBtn) allSubBtn.classList.add('active');
            
            filterServices();
        });
    });

    // Subcategory button handlers
    document.querySelectorAll('.subcategory-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            console.log('Subcategory clicked:', this.getAttribute('data-subcategory'));
            
            // Update active state
            document.querySelectorAll('.subcategory-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update filter
            currentSubcategory = this.getAttribute('data-subcategory');
            filterServices();
        });
    });
    
    // Initial load
    filterServices();
});