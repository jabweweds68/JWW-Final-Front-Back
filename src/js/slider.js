const slider = document.querySelector(".inner-product-cards-container");
let isDown = false;
let startX;
let currentX = 0;
let prevX = 0;
let velocity = 0;
let animationFrame;

function animate() {
  currentX += velocity;
  velocity *= 0.95; // friction

  // boundaries
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

// --- Desktop Events ---
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

// --- Mobile Touch Events ---
slider.addEventListener("touchstart", (e) => {
  isDown = true;
  startX = e.touches[0].pageX;
  prevX = currentX;
  velocity = 0;
  cancelAnimationFrame(animationFrame);
});

slider.addEventListener("touchend", () => {
  isDown = false;
  requestAnimationFrame(animate);
});

slider.addEventListener("touchmove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const delta = e.touches[0].pageX - startX;
  currentX = prevX + delta;
  velocity = delta - (currentX - prevX);
  slider.style.transform = `translateX(${currentX}px)`;
}, { passive: false }); // passive: false to allow preventDefault
