const slider = document.getElementById("dynamic-products-container");
const leftArrow = document.querySelector(".left-slide");
const rightArrow = document.querySelector(".right-slide");

let isDown = false;
let startX, startY;
let currentX = 0;
let prevX = 0;
let velocity = 0;
let animationFrame;

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

/* -----------------------
   🖥 DESKTOP EVENTS
----------------------- */
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

/* -----------------------
   📱 MOBILE EVENTS
----------------------- */
let isDragging = false;
let isScrolling = false;

slider.addEventListener("touchstart", (e) => {
  isDown = true;
  startX = e.touches[0].pageX;
  startY = e.touches[0].pageY;
  prevX = currentX;
  velocity = 0;
  isDragging = false;
  isScrolling = false;
  cancelAnimationFrame(animationFrame);
}, { passive: true });

slider.addEventListener("touchmove", (e) => {
  if (!isDown) return;

  const deltaX = e.touches[0].pageX - startX;
  const deltaY = e.touches[0].pageY - startY;

  if (!isDragging && !isScrolling) {
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      isScrolling = true; // let page scroll
      return;
    } else {
      isDragging = true; // horizontal drag
    }
  }

  if (isDragging) {
    e.preventDefault(); // block vertical scroll only while dragging horizontally
    currentX = prevX + deltaX;
    velocity = deltaX - (currentX - prevX);
    slider.style.transform = `translateX(${currentX}px)`;
  }
}, { passive: false });

slider.addEventListener("touchend", () => {
  if (isDragging) {
    requestAnimationFrame(animate);
  }
  isDown = false;
  isDragging = false;
  isScrolling = false;
});

/* -----------------------
   ⬅️➡️ ARROW BUTTONS
----------------------- */
function slideBy(amount) {
  cancelAnimationFrame(animationFrame);
  currentX += amount;

  const maxTranslate = 0;
  const minTranslate = -(slider.scrollWidth - slider.parentElement.offsetWidth);

  if (currentX > maxTranslate) currentX = maxTranslate;
  if (currentX < minTranslate) currentX = minTranslate;

  slider.style.transition = "transform 0.4s ease";
  slider.style.transform = `translateX(${currentX}px)`;
  setTimeout(() => slider.style.transition = "none", 400);
}

const card = slider.querySelector(".card-products-home");
const cardWidth = card ? card.offsetWidth + 48 : 360; // 48px gap, adjust to your CSS

leftArrow.addEventListener("click", () => {
  slideBy(cardWidth); // move right
});

rightArrow.addEventListener("click", () => {
  slideBy(-cardWidth); // move left
});
