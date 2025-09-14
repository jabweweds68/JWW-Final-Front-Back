// EmailJS checkout-page.js - With Backend Integration
import "../scss/Main.scss";
import "./side-bar";
import "./marquee";

// ===== SINGLE CONFIGURATION =====

const CHECKOUT_CONFIG = {
    adminWhatsApp: '+923111246705',
    companyName: 'JWW Chocolates',
    currency: 'PKR',
    deliveryCharge: 250,
    // Backend API Configuration
    apiBaseUrl: "https://jww-backend-main-production.up.railway.app",
    // EmailJS Configuration - Replace with your actual credentials
    emailJS: {
        publicKey: '1RkfeMikntWtXPQjS',
        serviceId: 'service_dfpatsi',
        templateId: 'template_implh0e'
    }
};

// ===== CART MANAGEMENT =====
let checkoutCart = [];

function loadCheckoutCart() {
    try {
        const savedCart = localStorage.getItem('jww_cart');
        checkoutCart = savedCart ? JSON.parse(savedCart) : [];
        // console.log('Loaded cart for checkout:', checkoutCart);
    } catch (error) {
        console.error('Error loading cart:', error);
        checkoutCart = [];
    }
}

function displayCheckoutCart() {
    const cartContainer = document.getElementById('checkout-cart-items');
    const productsTotal = document.getElementById('checkout-products-total');
    const subtotal = document.getElementById('checkout-subtotal');

    if (checkoutCart.length === 0) {
        cartContainer.innerHTML = '<div class="empty-cart">Your cart is empty. <a href="./index.html">Continue Shopping</a></div>';
        productsTotal.textContent = '0';
        subtotal.textContent = '250';
        return;
    }

    cartContainer.innerHTML = checkoutCart.map(item => `
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
            <div class="quantity-ch-num">${item.quantity}</div>
        </div>
    `).join('');

    const cartTotal = checkoutCart.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0);
    const finalTotal = cartTotal + CHECKOUT_CONFIG.deliveryCharge;

    productsTotal.textContent = cartTotal;
    subtotal.textContent = finalTotal;
}

// ===== FORM VALIDATION =====
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    field.classList.remove('error');
    removeErrorMessage(field);

    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = `${field.placeholder} is required`;
    }

    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }

    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,15}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }

    if (!isValid) {
        field.classList.add('error');
        showErrorMessage(field, errorMessage);
    }

    return isValid;
}

function showErrorMessage(field, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function removeErrorMessage(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function validateForm() {
    const requiredFields = ['email', 'phone', 'first-name', 'last-name', 'address', 'city', 'postal-code'];
    let isValid = true;

    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

// ===== BACKEND API INTEGRATION =====
async function saveOrderToBackend(orderData) {
    // console.log('=== SAVING ORDER TO BACKEND ===');
    // console.log('API Endpoint:', `${CHECKOUT_CONFIG.apiBaseUrl}/Order`);

    // Transform cart data to match your schema
    const backendOrderData = {
        items: checkoutCart.map(item => ({
            image: item.image || './assets/images/ABout-pic.png',
            title: item.name, // Map 'name' to 'title'
            quantity: item.quantity,
            size: item.size || 'Regular',
            price: item.totalPrice // This is the unit price
        }))
    };

    // console.log('Backend order data:', backendOrderData);

    try {
        const response = await fetch(`${CHECKOUT_CONFIG.apiBaseUrl}/Order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(backendOrderData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        // console.log('Backend response:', result);

        if (result.success) {
            // console.log('Order saved to backend successfully:', result.data._id);
            return {
                success: true,
                orderId: result.data._id,
                backendOrderId: result.data._id,
                totalCartPrice: result.data.totalCartPrice
            };
        } else {
            throw new Error(result.message || 'Failed to save order');
        }

    } catch (error) {
        console.error('Backend API Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

function generateOrderId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `JWW-${timestamp}-${random}`.toUpperCase();
}

async function sendEmailConfirmation(orderData) {
    // console.log('=== SENDING EMAIL DIRECTLY TO CUSTOMER VIA EMAILJS ===');
    // console.log('Customer Email:', orderData.customer.email);

    if (typeof emailjs === 'undefined') {
        console.error('EmailJS library not loaded');
        return false;
    }

    const templateParams = {
        email: orderData.customer.email,
        to_email: orderData.customer.email,
        reply_to: orderData.customer.email,
        to_name: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
        customer_name: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
        customer_first_name: orderData.customer.firstName,
        customer_last_name: orderData.customer.lastName,
        customer_phone: orderData.customer.phone,

        order_id: orderData.orderId,
        backend_order_id: orderData.backendOrderId, // Add backend order ID
        order_date: new Date(orderData.timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        order_time: new Date(orderData.timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }),

        order_items: formatCartForEmail(orderData.cart),
        order_items_html: formatCartForEmailHTML(orderData.cart),
        total_items: checkoutCart.reduce((sum, item) => sum + item.quantity, 0),

        delivery_address: formatDeliveryAddress(orderData.customer),
        delivery_address_line1: orderData.customer.address,
        delivery_address_line2: orderData.customer.apartment || '',
        delivery_city: orderData.customer.city,
        delivery_postal_code: orderData.customer.postalCode,

        subtotal: orderData.totals.subtotal,
        delivery_charge: orderData.totals.delivery,
        total_amount: orderData.totals.total,
        currency: CHECKOUT_CONFIG.currency,

        company_name: CHECKOUT_CONFIG.companyName,
        admin_whatsapp: CHECKOUT_CONFIG.adminWhatsApp,
        from_name: CHECKOUT_CONFIG.companyName,

        payment_method: 'Cash on Delivery',
        estimated_delivery: '2-3 working days',

        subject: `Order Confirmation - ${orderData.orderId}`,
        greeting: `Dear ${orderData.customer.firstName}`,
        thank_you_message: `Thank you for your order with ${CHECKOUT_CONFIG.companyName}!`,

        support_whatsapp: CHECKOUT_CONFIG.adminWhatsApp,
        support_message: 'If you have any questions about your order, please contact us via WhatsApp.'
    };

    // console.log('EmailJS template params:', templateParams);

    try {
        const response = await emailjs.send(
            CHECKOUT_CONFIG.emailJS.serviceId,
            CHECKOUT_CONFIG.emailJS.templateId,
            templateParams
        );

        // console.log('EmailJS Success:', response);
        return response.status === 200;
    } catch (error) {
        console.error('EmailJS Error:', error);
        return false;
    }
}

function formatCartForEmail(cart) {
    return cart.map((item, index) => {
        const size = item.size ? ` (${item.size.charAt(0).toUpperCase() + item.size.slice(1)})` : '';
        const boxes = item.boxCount > 1 ? ` - ${item.boxCount} Boxes` : '';
        return `${index + 1}. ${item.name}${size}${boxes} x${item.quantity} = ${CHECKOUT_CONFIG.currency} ${item.totalPrice * item.quantity}`;
    }).join('\n');
}

function formatCartForEmailHTML(cart) {
    return cart.map((item, index) => {
        const size = item.size ? ` (${item.size.charAt(0).toUpperCase() + item.size.slice(1)})` : '';
        const boxes = item.boxCount > 1 ? ` - ${item.boxCount} Boxes` : '';
        return `<tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${index + 1}. ${item.name}${size}${boxes}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${CHECKOUT_CONFIG.currency} ${item.totalPrice * item.quantity}</td>
        </tr>`;
    }).join('');
}

function formatDeliveryAddress(customer) {
    return `${customer.firstName} ${customer.lastName}
${customer.address}${customer.apartment ? '\n' + customer.apartment : ''}
${customer.city}, ${customer.postalCode}
Phone: ${customer.phone}`;
}

// ===== WHATSAPP SERVICE =====
function sendAdminWhatsApp(orderData) {
    // console.log('=== SENDING WHATSAPP TO ADMIN ===');

    const message = `NEW ORDER RECEIVED
    // Frontend Order ID: ${orderData.orderId}
    // Backend Order ID: ${orderData.backendOrderId}
    
    Customer:
    ${orderData.customer.firstName} ${orderData.customer.lastName}
    email: ${orderData.customer.email}
    phone: ${orderData.customer.phone}
    Time: ${new Date().toLocaleString()}

    Delivery Address:
    ${orderData.customer.address}
    ${orderData.customer.apartment ? orderData.customer.apartment + '\n' : ''}${orderData.customer.city}, ${orderData.customer.postalCode}

     Order Items:
    ${formatCartForEmail(orderData.cart)}

    Total: ${CHECKOUT_CONFIG.currency} ${orderData.totals.total}
    Payment: Cash on Delivery`

    const whatsappUrl = `https://wa.me/${CHECKOUT_CONFIG.adminWhatsApp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// ===== UI HELPERS =====
function showLoadingOverlay(message) {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
        <div class="loading-content">
            <div class="spinner"></div>
            <div>${message}</div>
        </div>
    `;
    document.body.appendChild(overlay);
    return overlay;
}

function hideLoadingOverlay(overlay) {
    if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
    }
}

// ===== MAIN FORM SUBMISSION WITH BACKEND INTEGRATION =====
async function handleFormSubmission(event) {
    if (event) event.preventDefault();

    // console.log('=== FORM SUBMISSION STARTED ===');

    // Check cart
    if (checkoutCart.length === 0) {
        alert('Your cart is empty. Please add items before placing an order.');
        return;
    }

    // Validate form
    if (!validateForm()) {
        // console.log('Form validation failed');
        return;
    }

    // Get form data
    const formData = {
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        firstName: document.getElementById('first-name').value.trim(),
        lastName: document.getElementById('last-name').value.trim(),
        address: document.getElementById('address').value.trim(),
        apartment: document.getElementById('apartment').value.trim(),
        city: document.getElementById('city').value.trim(),
        postalCode: document.getElementById('postal-code').value.trim(),
        orderUpdates: document.getElementById('order-updates').checked,
        marketingUpdates: document.getElementById('marketing-updates').checked,
        saveInfo: document.getElementById('save-info').checked
    };

    // Generate frontend order ID
    const frontendOrderId = generateOrderId();
    const cartTotal = checkoutCart.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0);

    // Show loading
    const loadingOverlay = showLoadingOverlay("Processing....");
    const placeOrderBtn = document.getElementById('place-order-btn');
    const originalText = placeOrderBtn.textContent;
    placeOrderBtn.textContent = 'Processing...';
    placeOrderBtn.style.pointerEvents = 'none';

    try {
        // Step 1: Save order to backend
        // console.log('Step 1: Saving to backend...');
        const backendResult = await saveOrderToBackend();

        if (!backendResult.success) {
            throw new Error(`Backend save failed: ${backendResult.error}`);
        }

        // console.log('Backend save successful:', backendResult);

        // Update loading message
        loadingOverlay.querySelector('.loading-content div:last-child').textContent = 'Placing your order...';

        // Step 2: Prepare order data with backend ID
        const orderData = {
            orderId: frontendOrderId,
            backendOrderId: backendResult.backendOrderId,
            customer: formData,
            cart: checkoutCart,
            totals: {
                subtotal: cartTotal,
                delivery: CHECKOUT_CONFIG.deliveryCharge,
                total: cartTotal + CHECKOUT_CONFIG.deliveryCharge
            },
            timestamp: new Date().toISOString()
        };

        // Step 3: Send email to customer
        // console.log('Step 3: Sending email to customer...');
        const emailSent = await sendEmailConfirmation(orderData);

        // Step 4: Send WhatsApp to admin
        // console.log('Step 4: Sending WhatsApp to admin...');
        sendAdminWhatsApp(orderData);

        // Step 5: Save order locally for backup
        const orders = JSON.parse(localStorage.getItem('jww_orders') || '[]');
        orders.unshift(orderData);
        localStorage.setItem('jww_orders', JSON.stringify(orders.slice(0, 50)));

        // Step 6: Clear cart
        localStorage.removeItem('jww_cart');

        // Hide loading
        hideLoadingOverlay(loadingOverlay);

        // Success message
        //         alert(`✅ ORDER PLACED SUCCESSFULLY!

        // Frontend Order ID: ${frontendOrderId}
        // Database Order ID: ${backendResult.backendOrderId}
        // Total Amount: ${CHECKOUT_CONFIG.currency} ${backendResult.totalCartPrice}

        // ✅ Order saved to database
        // ${emailSent ? `📧 Confirmation email sent to: ${formData.email}` : '⚠️ Email failed - please check EmailJS setup'}
        // 📱 Order details sent to admin via WhatsApp

        // We will contact you within 24 hours!

        // Thank you for choosing ${CHECKOUT_CONFIG.companyName}!`);

        // Reset and redirect
        document.getElementById('checkout-form').reset();
        setTimeout(() => {
            window.location.href = '/product-page';
        }, 3000);

    } catch (error) {
        console.error('Order processing error:', error);
        hideLoadingOverlay(loadingOverlay);

        // Reset button
        placeOrderBtn.textContent = originalText;
        placeOrderBtn.style.pointerEvents = '';

        alert(`❌ ORDER PROCESSING FAILED

Error: ${error.message}

Please check:
- Your internet connection
- Backend server is running on ${CHECKOUT_CONFIG.apiBaseUrl}
- EmailJS configuration

Try again or contact support.`);
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function () {
    // console.log('=== INITIALIZING CHECKOUT WITH BACKEND INTEGRATION ===');
    // console.log('Config:', CHECKOUT_CONFIG);

    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init(CHECKOUT_CONFIG.emailJS.publicKey);
        // console.log('EmailJS initialized successfully');
    } else {
        console.error('EmailJS library not loaded!');
    }

    // Load cart
    loadCheckoutCart();
    displayCheckoutCart();

    // Add event listeners
    const placeOrderBtn = document.getElementById('place-order-btn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', handleFormSubmission);
    }

    // Add form validation
    const form = document.getElementById('checkout-form');
    if (form) {
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    validateField(input);
                }
            });
        });
    }

    // Listen for cart updates
    window.addEventListener('storage', function (e) {
        if (e.key === 'jww_cart') {
            loadCheckoutCart();
            displayCheckoutCart();
        }
    });

    // console.log('Checkout with Backend Integration initialized successfully');
});