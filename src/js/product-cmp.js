import "../scss/Main.scss";
import "./side-bar";
import "./marquee";
import "./cart";
import "./ing-secction";
import "./faq-toggle";

import gsap from "gsap";


// Wait for DOM and dynamic content to be ready
function initializeProductSlider() {
  const sliderChImages = document.querySelectorAll("#slider-product-ch img");
  const sliderChPrevBtn = document.querySelectorAll(".btns-next-p-1")[0];
  const sliderChNextBtn = document.querySelectorAll(".btns-next-p-1")[1];

  // Check if elements exist
  if (!sliderChImages.length || !sliderChPrevBtn || !sliderChNextBtn) {
    console.log('Slider elements not ready yet, retrying...');
    return false;
  }

  // Don't initialize if already done by main script
  if (window.productSliderInitialized) {
    console.log('Product slider already initialized by main script');
    return true;
  }

  let sliderChCurrent = 0;
  let sliderChInterval;

  // Clean up any existing intervals
  if (window.sliderChInterval) {
    clearInterval(window.sliderChInterval);
  }

  // Use GSAP if available, otherwise fallback to CSS
  if (typeof gsap !== 'undefined') {
    // Hide all slides, show first
    gsap.set(sliderChImages, { opacity: 0 });
    gsap.set(sliderChImages[0], { opacity: 1 });

    function sliderChShowImage(index) {
      gsap.to(sliderChImages, { opacity: 0, duration: 0.8 });
      gsap.to(sliderChImages[index], { opacity: 1, duration: 0.8 });
    }

    function sliderChStartAuto() {
      if (sliderChImages.length <= 1) return; // Don't auto-slide single images
      
      window.sliderChInterval = setInterval(() => {
        sliderChCurrent = (sliderChCurrent + 1) % sliderChImages.length;
        sliderChShowImage(sliderChCurrent);
      }, 3000);
    }

    function sliderChStopAuto() {
      if (window.sliderChInterval) {
        clearInterval(window.sliderChInterval);
      }
    }

    // Prevent duplicate event listeners
    if (!sliderChNextBtn.hasProductCmpListener) {
      sliderChNextBtn.addEventListener("click", () => {
        sliderChStopAuto();
        sliderChCurrent = (sliderChCurrent + 1) % sliderChImages.length;
        sliderChShowImage(sliderChCurrent);
        sliderChStartAuto();
      });
      sliderChNextBtn.hasProductCmpListener = true;
    }

    if (!sliderChPrevBtn.hasProductCmpListener) {
      sliderChPrevBtn.addEventListener("click", () => {
        sliderChStopAuto();
        sliderChCurrent = (sliderChCurrent - 1 + sliderChImages.length) % sliderChImages.length;
        sliderChShowImage(sliderChCurrent);
        sliderChStartAuto();
      });
      sliderChPrevBtn.hasProductCmpListener = true;
    }

    // Start autoplay
    sliderChStartAuto();
  } else {
    console.log('GSAP not available, skipping slider initialization');
    return false;
  }

  // Mark as initialized
  window.productSliderInitialized = true;
  
  return true; // Success
}

function initializeSizeButtons() {
  const sizeBtns = document.querySelectorAll(".sizes-btn .cta");
  
  if (!sizeBtns.length) {
    return false;
  }

  sizeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      sizeBtns.forEach(b => b.classList.remove("active-btn"));
      btn.classList.add("active-btn");
    });
  });

  // Make first button active by default
  sizeBtns[0].classList.add("active-btn");
  
  return true;
}

function initializeBoxes() {
  const boxes = document.querySelectorAll(".p-box-1");
  
  if (!boxes.length) {
    return false;
  }

  // Make first one active by default
  boxes[0].classList.add("active");

  boxes.forEach(box => {
    box.addEventListener("click", () => {
      boxes.forEach(b => b.classList.remove("active"));
      box.classList.add("active");
    });
  });
  
  return true;
}

function adjustCartHeight() {
  const productsCard = document.querySelector(".cart-products-card");
  
  if (!productsCard) {
    return false;
  }
  
  const products = productsCard.querySelectorAll(".cart-products").length;

  if (products === 1) {
    productsCard.style.height = "55%";
  } else if (products === 2) {
    productsCard.style.height = "100%";
  } else {
    productsCard.style.height = "fit-content";
  }
  
  return true;
}

// Retry function with exponential backoff
function retryInitialization(initFunc, maxRetries = 10, delay = 100) {
  let retries = 0;
  
  function attempt() {
    const success = initFunc();
    
    if (success) {
      console.log(`${initFunc.name} initialized successfully`);
      return;
    }
    
    retries++;
    if (retries < maxRetries) {
      setTimeout(attempt, delay * Math.pow(1.5, retries)); // Exponential backoff
    } else {
      console.warn(`${initFunc.name} failed to initialize after ${maxRetries} attempts`);
    }
  }
  
  attempt();
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('Product component initializing...');
  
  // Wait a bit for the main product page script to create elements
  setTimeout(() => {
    retryInitialization(initializeProductSlider);
    retryInitialization(initializeSizeButtons);
    retryInitialization(initializeBoxes);
    retryInitialization(adjustCartHeight);
  }, 500);
});

// Also listen for custom events from the main product script
document.addEventListener('productDataLoaded', () => {
  console.log('Product data loaded, reinitializing components...');
  
  setTimeout(() => {
    retryInitialization(initializeProductSlider);
    retryInitialization(initializeSizeButtons);
    retryInitialization(initializeBoxes);
    retryInitialization(adjustCartHeight);
  }, 200);
});

// Export functions for manual initialization if needed
window.productComponentsInit = {
  initializeProductSlider,
  initializeSizeButtons,
  initializeBoxes,
  adjustCartHeight
};