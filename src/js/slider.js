const slider = document.getElementById("dynamic-products-container");
const leftArrow = document.querySelector(".left-slide");
const rightArrow = document.querySelector(".right-slide");

let isDown = false;
let startX, startY;
let currentX = 0;
let prevX = 0;
let velocity = 0;
let animationFrame;

const isMobile = window.innerWidth <= 768; // 📱 change breakpoint if needed



if (!isMobile) {
  function animate() {
    currentX += velocity;
    velocity *= 0.95; // friction

    const maxTranslate = 0;
    const minTranslate = -(slider.scrollWidth - slider.parentElement.offsetWidth);

    if (currentX > maxTranslate) {
      currentX = maxTranslate;
      velocity = 0;
    }
    if (currentX < minTranslate) {
      currentX = minTranslate;
      velocity = 0;
    }

    slider.style.transform = `translateX(${currentX}px)`;

    if (Math.abs(velocity) > 0.1) {
      animationFrame = requestAnimationFrame(animate);
    }
  }

  // Desktop events
  slider.addEventListener("mousedown", (e) => {
    isDown = true;
    startX = e.pageX;
    prevX = currentX;
    velocity = 0;
    cancelAnimationFrame(animationFrame);
  });

  slider.addEventListener("mouseup", () => {
    isDown = false;
    requestAnimationFrame(animate);
  });

  slider.addEventListener("mouseleave", () => {
    isDown = false;
  });

  slider.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const delta = e.pageX - startX;
    currentX = prevX + delta;
    velocity = delta - (currentX - prevX);
    slider.style.transform = `translateX(${currentX}px)`;
  });
}

/* -----------------------
   📱 MOBILE (snap per card)
----------------------- */
if (isMobile) {
  let isDragging = false;
  let isScrolling = false;
  let targetX = 0;

  const card = slider.querySelector(".card-products-home");
  const cardWidth = card ? card.offsetWidth + 48 : 415; // adjust gap

  function updateSlider() {
    slider.style.transition = "transform 0.4s ease";
    slider.style.transform = `translateX(${targetX}px)`;
    setTimeout(() => slider.style.transition = "none", 400);
  }

  slider.addEventListener("touchstart", (e) => {
    isDown = true;
    startX = e.touches[0].pageX;
    startY = e.touches[0].pageY;
    prevX = targetX;
    isDragging = false;
    isScrolling = false;
  }, { passive: true });

  slider.addEventListener("touchmove", (e) => {
    if (!isDown) return;

    const deltaX = e.touches[0].pageX - startX;
    const deltaY = e.touches[0].pageY - startY;

    if (!isDragging && !isScrolling) {
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        isScrolling = true;
        return;
      } else {
        isDragging = true;
      }
    }

    if (isDragging) {
      e.preventDefault();
      targetX = prevX + deltaX;
      slider.style.transform = `translateX(${targetX}px)`;
    }
  }, { passive: false });

  slider.addEventListener("touchend", () => {
    if (isDragging) {
      // Snap to nearest card
      const index = Math.round(Math.abs(targetX) / cardWidth);
      targetX = -index * cardWidth;

      const maxTranslate = 0;
      const minTranslate = -(slider.scrollWidth - slider.parentElement.offsetWidth);

      if (targetX > maxTranslate) targetX = maxTranslate;
      if (targetX < minTranslate) targetX = minTranslate;

      updateSlider();
    }
    isDown = false;
    isDragging = false;
    isScrolling = false;
  });

  // Arrows for mobile
  leftArrow.addEventListener("click", () => {
    targetX += cardWidth;
    if (targetX > 0) targetX = 0;
    updateSlider();
  });

  rightArrow.addEventListener("click", () => {
    targetX -= cardWidth;
    const minTranslate = -(slider.scrollWidth - slider.parentElement.offsetWidth);
    if (targetX < minTranslate) targetX = minTranslate;
    updateSlider();
  });
}
