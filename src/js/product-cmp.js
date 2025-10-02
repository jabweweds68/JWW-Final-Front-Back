import "../scss/Main.scss";
import "./side-bar";
import "./marquee";
import "./cart";
import "./ing-secction";
import "./faq-toggle";

import gsap from "gsap";

// Global flag to prevent duplicate initializations
let productSliderInitialized = false;

// Wait for DOM and dynamic content to be ready
function initializeProductSlider() {
  const sliderChImages = document.querySelectorAll("#slider-product-ch img");
  const sliderChPrevBtn = document.querySelectorAll(".btns-next-p-1")[0];
  const sliderChNextBtn = document.querySelectorAll(".btns-next-p-1")[1];

  // Check if elements exist
  if (!sliderChImages.length || !sliderChPrevBtn || !sliderChNextBtn) {
    // console.log('Slider elements not ready yet, retrying...');
    return false;
  }

  // IMPORTANT: Don't initialize if main script already handled it
  if (window.productSliderInitialized) {
    // console.log('Product slider already initialized by main script');
    return true;
  }

  // Clean up any existing intervals first
  if (window.sliderChInterval) {
    clearInterval(window.sliderChInterval);
    window.sliderChInterval = null;
  }

  let sliderChCurrent = 0;

  // Use GSAP if available, otherwise fallback to CSS
  if (typeof gsap !== 'undefined') {
    // Hide all slides, show first
    gsap.set(sliderChImages, { opacity: 0 });
    gsap.set(sliderChImages[0], { opacity: 1 });

    function sliderChShowImage(index) {
      gsap.to(sliderChImages, { opacity: 0, duration: 0 });
      gsap.to(sliderChImages[index], { opacity: 1, duration: 0 });
    }

    function sliderChStartAuto() {
      if (sliderChImages.length <= 1) return;
      
      window.sliderChInterval = setInterval(() => {
        sliderChCurrent = (sliderChCurrent + 1) % sliderChImages.length;
        sliderChShowImage(sliderChCurrent);
      }, 3000);
    }

    function sliderChStopAuto() {
      if (window.sliderChInterval) {
        clearInterval(window.sliderChInterval);
        window.sliderChInterval = null;
      }
    }

    // Remove existing listeners to prevent duplicates
    const newNextBtn = sliderChNextBtn.cloneNode(true);
    const newPrevBtn = sliderChPrevBtn.cloneNode(true);
    sliderChNextBtn.parentNode.replaceChild(newNextBtn, sliderChNextBtn);
    sliderChPrevBtn.parentNode.replaceChild(newPrevBtn, sliderChPrevBtn);

    // Add fresh event listeners
    newNextBtn.addEventListener("click", () => {
      sliderChStopAuto();
      sliderChCurrent = (sliderChCurrent + 1) % sliderChImages.length;
      sliderChShowImage(sliderChCurrent);
      sliderChStartAuto();
    });

    newPrevBtn.addEventListener("click", () => {
      sliderChStopAuto();
      sliderChCurrent = (sliderChCurrent - 1 + sliderChImages.length) % sliderChImages.length;
      sliderChShowImage(sliderChCurrent);
      sliderChStartAuto();
    });

    // Start autoplay
    sliderChStartAuto();
  } else {
    // console.log('GSAP not available, skipping slider initialization');
    return false;
  }

  // Mark as initialized by this script only
  productSliderInitialized = true;
  
  return true;
}

function initializeSizeButtons() {
  const sizeBtns = document.querySelectorAll(".sizes-btn .cta");
  
  if (!sizeBtns.length) {
    return false;
  }

  // Remove existing listeners by cloning elements
  sizeBtns.forEach((btn, index) => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
  });

  // Get fresh references and add listeners
  const freshSizeBtns = document.querySelectorAll(".sizes-btn .cta");
  
  freshSizeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      freshSizeBtns.forEach(b => b.classList.remove("active-btn"));
      btn.classList.add("active-btn");
    });
  });

  // Make first button active by default if none are active
  if (!document.querySelector(".sizes-btn .cta.active-btn")) {
    freshSizeBtns[0]?.classList.add("active-btn");
  }
  
  return true;
}

function initializeBoxes() {
  const boxes = document.querySelectorAll(".p-box-1");
  
  if (!boxes.length) {
    return false;
  }

  // Remove existing listeners by cloning elements
  boxes.forEach((box, index) => {
    const newBox = box.cloneNode(true);
    box.parentNode.replaceChild(newBox, box);
  });

  // Get fresh references and add listeners
  const freshBoxes = document.querySelectorAll(".p-box-1");

  freshBoxes.forEach(box => {
    box.addEventListener("click", () => {
      freshBoxes.forEach(b => b.classList.remove("active"));
      box.classList.add("active");
    });
  });

  // Make first one active by default if none are active
  if (!document.querySelector(".p-box-1.active")) {
    freshBoxes[0]?.classList.add("active");
  }
  
  return true;
}

function adjustCartHeight() {
  const productsCard = document.querySelector(".cart-products-card");
  
  if (!productsCard) {
    return false;
  }
  
  const products = productsCard.querySelectorAll(".cart-products").length;

  if (products === 1) {
    productsCard.style.height = "68%";
  } else if (products === 2) {
    productsCard.style.height = "65%";
  } else {
    productsCard.style.height = "fit-content";
  }
  
  return true;
}

// Cleanup function to reset state
function cleanup() {
  // console.log('Cleaning up product components...');
  
  // Clear any intervals
  if (window.sliderChInterval) {
    clearInterval(window.sliderChInterval);
    window.sliderChInterval = null;
  }
  
  // Reset initialization flag
  productSliderInitialized = false;
}

// Retry function with exponential backoff
function retryInitialization(initFunc, maxRetries = 8, delay = 100) {
  let retries = 0;
  
  function attempt() {
    const success = initFunc();
    
    if (success) {
      // console.log(`${initFunc.name} initialized successfully`);
      return;
    }
    
    retries++;
    if (retries < maxRetries) {
      setTimeout(attempt, delay * Math.pow(1.3, retries));
    } else {
      console.warn(`${initFunc.name} failed to initialize after ${maxRetries} attempts`);
    }
  }
  
  attempt();
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // console.log('Product component initializing...');
  
  // Wait for the main product page script to create elements
  setTimeout(() => {
    if (!window.productSliderInitialized) {
      retryInitialization(initializeProductSlider);
    }
    retryInitialization(initializeSizeButtons);
    retryInitialization(initializeBoxes);
    retryInitialization(adjustCartHeight);
  }, 800);
});

// Listen for product changes and reinitialize components
document.addEventListener('productDataLoaded', (event) => {
  // console.log('Product data loaded, reinitializing components...');
  
  // Cleanup first
  cleanup();
  
  // Wait a bit for DOM updates to complete
  setTimeout(() => {
    // Only initialize slider if main script hasn't done it
    if (!window.productSliderInitialized) {
      retryInitialization(initializeProductSlider);
    }
    retryInitialization(initializeSizeButtons);
    retryInitialization(initializeBoxes);
    retryInitialization(adjustCartHeight);
  }, 300);
});

// Export functions for manual initialization if needed
window.productComponentsInit = {
  initializeProductSlider,
  initializeSizeButtons,
  initializeBoxes,
  adjustCartHeight,
  cleanup
};


function showCartToast(message) {
  const toast = document.getElementById('cart-toast');
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000); // hides after 2 seconds
}



document.addEventListener("DOMContentLoaded", () => {
  const addToCartBtns = document.querySelectorAll(".add-to-cart-pop");
  const cartMessage = document.querySelector(".add-to-cart-message");

  addToCartBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      if (cartMessage) {
        cartMessage.style.display = "block";   // show
        cartMessage.style.opacity = "1";

        // Hide again after 3s
        setTimeout(() => {
          cartMessage.style.opacity = "0";
          setTimeout(() => {
            cartMessage.style.display = "none";
          }, 300); // wait for fade-out
        }, 3000);
      }
    });
  });
});
