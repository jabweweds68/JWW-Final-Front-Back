import "../scss/Main.scss";
import "./side-bar";
import "./marquee";

import gsap from "gsap";
document.querySelectorAll(".float-el-img").forEach((el, i) => {
  gsap.to(el, {
    y: -900,
    repeat: -1,
   stagger: 1,
   delay: i * 1,
    ease: "power1.inOut",
    duration: 10,
   
  });
});



// thankyou.js - Auto WhatsApp redirect with 5-second delay
// import "./marquee";

// Configuration
const CONFIG = {
    BACKEND_URL: 'https://jww-backend-main-production.up.railway.app'
};

// Product mapping for navigation
const PRODUCT_MAPPING = {
    'DARK DESIRE': 'dark-desire',
    'STRAWBAE': 'strawbae', 
    'VANILLALUST': 'vanillalust',
    'BUNDLE': 'bundle'
};

// ===== WHATSAPP AUTO-REDIRECT FUNCTIONALITY =====
function initializeWhatsAppRedirect() {
    const whatsappUrl = localStorage.getItem('jww_whatsapp_url');
    
    if (whatsappUrl) {
        setTimeout(() => {
            window.location.href = whatsappUrl;  
            localStorage.removeItem('jww_whatsapp_url');
        }, 4000);
    }
}

// ===== NAVIGATION FUNCTIONS =====
function setupMenuProductNavigation() {
    const staticMenuBoxes = document.querySelectorAll('.slide-bar .box');

    staticMenuBoxes.forEach(box => {
        const productName = box.querySelector('.name-box')?.textContent;

        if (productName && PRODUCT_MAPPING[productName]) {
            box.removeAttribute('id');
            box.classList.add('menu-product-item');
            box.style.cursor = 'pointer';

            box.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const productSlug = PRODUCT_MAPPING[productName];
                navigateToProduct(productSlug, productName);
            });
        }
    });
}

function navigateToProduct(productSlug, productName) {
    const url = `./product-page.html?product=${encodeURIComponent(productSlug)}&name=${encodeURIComponent(productName)}`;
    window.location.href = url;
}

async function updateMenuWithAPIProducts() {
    try {
        const response = await fetch(`${CONFIG.BACKEND_URL}/GetAllProducts`);
        const data = await response.json();

        if (data.success && data.products) {
            updateDynamicMenu(data.products);
        }
    } catch (error) {
        console.error('Error fetching products for menu:', error);
    }
}

function updateDynamicMenu(products) {
    const menuContainer = document.querySelector('.slide-bar .grid-box-container');
    if (!menuContainer) return;

    menuContainer.innerHTML = products.map(product => {
        const categoryClass = getCategoryClass(product.category);

        return `
            <div class="box ${categoryClass}" data-product-id="${product._id}">
                <div class="elents"><img src="./assets/images/el-1.png" alt=""></div>
                <div class="elents"><img src="./assets/images/marq-2.png" alt=""></div>
                <div class="elents"><img src="./assets/images/el-2.png" alt=""></div>
                <div class="name-box">${product.title.toUpperCase()}</div>
                <div class="choco-menu">
                    <img src="${getImageUrl(product.images[0])}" alt="${product.title}">
                </div>
            </div>
        `;
    }).join('');

    setupDynamicMenuNavigation(products);
}

function setupDynamicMenuNavigation(products) {
    const menuBoxes = document.querySelectorAll('.slide-bar .box[data-product-id]');

    menuBoxes.forEach(box => {
        box.style.cursor = 'pointer';
        box.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const productId = box.dataset.productId;
            const product = products.find(p => p._id === productId);

            if (product) {
                const productSlug = product.title.toLowerCase().replace(/\s+/g, '-');
                navigateToProductById(productId, product.title, productSlug);
            }
        });
    });
}

function navigateToProductById(productId, productName, productSlug) {
    const url = `./product-page.html?productId=${encodeURIComponent(productId)}&name=${encodeURIComponent(productName)}&product=${encodeURIComponent(productSlug)}`;
    window.location.href = url;
}

function getCategoryClass(category) {
    switch (category?.toLowerCase()) {
        case 'strawberry flavour':
            return 'straw-bg';
        case 'dark desire':
            return '';
        case 'vanilla lust':
            return 'vanilla-bg';
        default:
            return '';
    }
}

function getImageUrl(image) {
    if (!image) return './assets/images/ABout-pic.png';
    const imageUrl = typeof image === 'string' ? image : image.url;
    return imageUrl ? `${CONFIG.BACKEND_URL}${imageUrl}` : './assets/images/ABout-pic.png';
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('Thank you page loaded, initializing...');
    
    // Initialize WhatsApp redirect with 5-second delay
    initializeWhatsAppRedirect();
    
    // Setup navigation
    setupMenuProductNavigation();
    updateMenuWithAPIProducts();

    // Setup other product page links (non-menu items)
    const otherProductLinks = document.querySelectorAll("#product-page:not(.slide-bar .box)");
    otherProductLinks.forEach(element => {
        element.style.cursor = "pointer";
        element.addEventListener("click", () => {
            window.location.href = "./product-page.html";
        });
    });

    console.log('Thank you page initialization complete');
});