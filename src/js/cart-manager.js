// cart-manager.js - Universal Cart Management System
// This file should be created as a separate JS file and imported in all pages


{/* <script src="./js/config.js"></script> */}
class CartManager {
    constructor() {
        this.cart = this.loadCartFromStorage();
        this.API_BASE_URL =  "https://jww-backend-main-production.up.railway.app";
        this.productsData = [];

        // Fallback product data for home page
        this.fallbackProducts = {
            strawbae: {
                name: 'Strawbae',
                image: './assets/images/strawbae.png',
                chocolate: './assets/images/strawbae.png',
                basePrice: 50
            },
            darkdesire: {
                name: 'Dark Desire',
                image: './assets/images/darkdesire.png',
                chocolate: './assets/images/darkdesire.png',
                basePrice: 50
            },
            vanilla: {
                name: 'Vanillalust',
                image: './assets/images/vanillalust.png',
                chocolate: './assets/images/vanillalust.png',
                basePrice: 50
            }
        };

        this.initCartElements();
        this.loadProductsData();
    }

    // Load products data from API for consistent product information
    async loadProductsData() {
        try {
            const response = await fetch(`${this.API_BASE_URL}/GetAllProducts`);
            const data = await response.json();
            if (data.success) {
                this.productsData = data.products;
                // console.log('Products data loaded:', this.productsData.length, 'products');
            }
        } catch (error) {
            console.error('Error loading products data:', error);
            // Will fallback to hardcoded data
        }
    }

    // Get product by ID
    getProductById(productId) {
        return this.productsData.find(p => p._id === productId);
    }

    // Get image URL with fallback
    getImageUrl(image) {
        if (!image) return './assets/images/ABout-pic.png';
        const imageUrl = typeof image === 'string' ? image : image.url;
        return imageUrl ? `${this.API_BASE_URL}${imageUrl}` : './assets/images/ABout-pic.png';
    }

    // Load cart from localStorage
    loadCartFromStorage() {
        try {
            const savedCart = localStorage.getItem('jww_cart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error('Error loading cart from storage:', error);
            return [];
        }
    }

    // Save cart to localStorage
    saveCartToStorage() {
        try {
            localStorage.setItem('jww_cart', JSON.stringify(this.cart));

            // Dispatch custom event for cart updates
            window.dispatchEvent(new CustomEvent('cartUpdated', {
                detail: {
                    cart: this.cart,
                    count: this.getCartCount(),
                    total: this.getCartTotal()
                }
            }));
        } catch (error) {
            console.error('Error saving cart to storage:', error);
        }
    }

    // Initialize cart DOM elements
    initCartElements() {
        this.cartContainer = document.querySelector('.products-wrapper');
        this.emptyMessage = document.getElementById('empty-cart-message');
        this.cartTotals = document.getElementById('cart-totals');
        this.openCartButton = document.getElementById('open-cart');
        this.closeCartButton = document.getElementById('close-cart');
        this.cartSection = document.getElementById('cart');

        // Initialize event listeners
        if (this.openCartButton) {
            this.openCartButton.addEventListener('click', () => this.openCart());
        }
        if (this.closeCartButton) {
            this.closeCartButton.addEventListener('click', () => this.closeCart());
        }

        const clearCartBtn = document.getElementById('clear-cart');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => this.clearCart());
        }

        // Listen for storage changes from other tabs/pages
        window.addEventListener('storage', (e) => {
            if (e.key === 'jww_cart') {
                this.cart = this.loadCartFromStorage();
                this.updateCartDisplay();
            }
        });

        // Listen for custom cart update events
        window.addEventListener('cartUpdated', () => {
            this.updateCartDisplay();
        });

        // Initial cart display update - delayed to ensure DOM is ready
        setTimeout(() => this.updateCartDisplay(), 100);
    }

    // Add item to cart - Updated to handle both API and fallback data
    addToCart(productData) {
        // console.log('Adding to cart:', productData);

        // Ensure we have all required data
        const cartItem = {
            productId: productData.productId || productData.id,
            name: productData.name,
            image: productData.image,
            flavor: productData.flavor || productData.productId,
            size: productData.size || 'regular',
            sizePrice: productData.sizePrice || 50,
            boxCount: productData.boxCount || 1,
            totalPrice: productData.totalPrice || (productData.sizePrice || 50),
            quantity: 1
        };

        const existingItemIndex = this.cart.findIndex(item =>
            item.productId === cartItem.productId &&
            item.size === cartItem.size &&
            item.boxCount === cartItem.boxCount
        );

        if (existingItemIndex > -1) {
            this.cart[existingItemIndex].quantity += 1;
            // console.log('Updated existing item quantity');
        } else {
            this.cart.push(cartItem);
            // console.log('Added new item to cart');
        }

        this.saveCartToStorage();
        this.updateCartDisplay();
        this.showCartNotification();

        return true;
    }

    // Change quantity of cart item
    changeQuantity(index, change) {
        if (this.cart[index]) {
            this.cart[index].quantity += change;

            if (this.cart[index].quantity <= 0) {
                this.cart.splice(index, 1);
            }

            this.saveCartToStorage();
            this.updateCartDisplay();
        }
    }

    // Clear entire cart
    clearCart() {
        this.cart = [];
        this.saveCartToStorage();
        this.updateCartDisplay();
    }

    // Update cart display
    updateCartDisplay() {
        if (!this.cartContainer) return;

        // console.log('Updating cart display, items:', this.cart.length);

        if (this.cart.length === 0) {
            if (this.emptyMessage) this.emptyMessage.style.display = 'block';
            if (this.cartTotals) this.cartTotals.style.display = 'none';
            this.cartContainer.innerHTML = '';
            return;
        }

        if (this.emptyMessage) this.emptyMessage.style.display = 'none';
        if (this.cartTotals) this.cartTotals.style.display = 'block';

        this.cartContainer.innerHTML = this.cart.map((item, index) => `
            <div class="cart-products">
                <div class="right-content-ct">
                    <div class="image-cart-p">
                        <img src="${item.image}" alt="${item.name}" onerror="this.src='./assets/images/ABout-pic.png'">
                    </div>
                    <div class="content-cart-product">
                        <div class="name-p">${item.name}</div>
                        <div class="p-size-cart">${item.size ? (item.size.charAt(0).toUpperCase() + item.size.slice(1)) : 'Regular'} - ${item.boxCount} Box${item.boxCount > 1 ? 'es' : ''}</div>
                        <div class="price-p">PKR: ${item.totalPrice * item.quantity}</div>
                    </div>
                </div>
                <div class="inc-dec-btn">
                    <div class="inc" onclick="cartManager.changeQuantity(${index}, 1)">+</div>
                    <div class="quantity">${item.quantity.toString().padStart(2, '0')}</div>
                    <div class="dec" onclick="cartManager.changeQuantity(${index}, -1)">-</div>
                </div>
            </div>
        `).join('');

        this.updateCartTotals();
    }

    // Update cart totals
    updateCartTotals() {
        const productsTotal = this.cart.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0);
        const deliveryCharges = 250;
        const subtotal = productsTotal + deliveryCharges;

        const productsTotalElement = document.getElementById('products-total');
        const subtotalElement = document.getElementById('subtotal');

        if (productsTotalElement) productsTotalElement.textContent = productsTotal;
        if (subtotalElement) subtotalElement.textContent = subtotal;
    }

    // Open cart
    openCart() {
        if (this.cartSection) {
            this.cartSection.classList.add('active');
        }
    }

    // Close cart
    closeCart() {
        if (this.cartSection) {
            this.cartSection.classList.remove('active');
        }
    }

    // Show cart notification
    showCartNotification() {
        // Try to find add to cart button and show notification
        const addToCartButton = document.getElementById('add-to-cart');
        if (addToCartButton) {
            const originalText = addToCartButton.textContent;
            addToCartButton.textContent = 'ADDED!';
            addToCartButton.style.backgroundColor = '#4CAF50';

            setTimeout(() => {
                addToCartButton.textContent = originalText;
                addToCartButton.style.backgroundColor = '';
            }, 1500);
        } else {
            // Fallback notification for home page
            // console.log('Item added to cart!');
            // Show a temporary notification
            this.showTemporaryNotification('Item added to cart!');
        }
    }

    // Show temporary notification
    showTemporaryNotification(message) {
        // Create notification element if it doesn't exist
        let notification = document.getElementById('cart-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'cart-notification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 15px 20px;
                border-radius: 5px;
                z-index: 1000;
                font-weight: bold;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(notification);
        }

        notification.textContent = message;
        notification.style.opacity = '1';

        setTimeout(() => {
            notification.style.opacity = '0';
        }, 2000);
    }

    // Get cart count
    getCartCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    // Get cart total
    getCartTotal() {
        return this.cart.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0);
    }

    // Helper method for home page - create product data from flavor
    createProductDataFromFlavor(flavor, size = 'small', boxCount = 1) {
        const sizeMultiplier = {
            'small': 1,
            'medium': 1.5,
            'large': 2
        };

        const product = this.fallbackProducts[flavor];
        if (!product) {
            console.error('Product not found:', flavor);
            return null;
        }

        const sizePrice = product.basePrice * (sizeMultiplier[size] || 1);
        const totalPrice = sizePrice * boxCount;

        return {
            productId: `${flavor}_home`, // Unique ID for home page items
            name: product.name,
            image: product.image,
            flavor: flavor,
            size: size,
            sizePrice: sizePrice,
            boxCount: boxCount,
            totalPrice: totalPrice
        };
    }

    // Method to add from home page
    addFromHomePage(flavor, size = 'small', boxCount = 1) {
        const productData = this.createProductDataFromFlavor(flavor, size, boxCount);
        if (productData) {
            // console.log('Adding from home page:', productData);
            return this.addToCart(productData);
        }
        return false;
    }
}

// Initialize global cart manager
const cartManager = new CartManager();

// Make it available globally for onclick handlers
window.cartManager = cartManager;

// Helper function for adding products from home page
window.addToCartFromHome = function (flavor, size = 'small', boxCount = 1) {
    // console.log('addToCartFromHome called with:', { flavor, size, boxCount });
    return cartManager.addFromHomePage(flavor, size, boxCount);
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CartManager;
}

// ========================================
// SHARED INITIALIZATION
// ========================================

// Initialize cart display on page load for all pages
document.addEventListener('DOMContentLoaded', function () {
    // console.log('DOM loaded, initializing cart...');

    // Update cart display after DOM is loaded
    setTimeout(() => {
        cartManager.updateCartDisplay();

        // You can add cart count badges or other indicators here
        const cartCount = cartManager.getCartCount();
        if (cartCount > 0) {
            // console.log(`Cart has ${cartCount} items`);
            // Update cart badge if you have one
        }
    }, 200);
});

// Listen for storage changes (when cart is updated on another tab)
window.addEventListener('storage', function (e) {
    if (e.key === 'jww_cart') {
        // console.log('Cart updated in another tab');
        cartManager.cart = cartManager.loadCartFromStorage();
        cartManager.updateCartDisplay();
    }
});