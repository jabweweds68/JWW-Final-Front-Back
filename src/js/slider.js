const slider = document.getElementById("dynamic-products-container");
const leftArrow = document.querySelector(".left-slide");
const rightArrow = document.querySelector(".right-slide");

let isDown = false;
let startX, startY;
let currentX = 0;
let prevX = 0;
let targetX = 0; // where we want to go
let velocity = 0;
let animationFrame;

/* -----------------------
   ⚡ Smooth Animation Loop
----------------------- */
function render() {
  // interpolate (lerp) for smoothness
  currentX += (targetX - currentX) * 0.15;

  // clamp
  const maxTranslate = 0;
  const minTranslate = -(slider.scrollWidth - slider.parentElement.offsetWidth);
  if (currentX > maxTranslate) currentX = maxTranslate;
  if (currentX < minTranslate) currentX = minTranslate;

  slider.style.transform = `translateX(${currentX}px)`;

  animationFrame = requestAnimationFrame(render);
}
render(); // start loop

/* -----------------------
   🖥 DESKTOP DRAG
----------------------- */
slider.addEventListener("mousedown", (e) => {
  isDown = true;
  startX = e.pageX;
  prevX = targetX;
  cancelAnimationFrame(animationFrame);
  render();
});

slider.addEventListener("mouseup", () => {
  isDown = false;
});

slider.addEventListener("mouseleave", () => {
  isDown = false;
});

slider.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const delta = e.pageX - startX;
  targetX = prevX + delta;
});

/* -----------------------
   📱 MOBILE DRAG
----------------------- */
let isDragging = false;
let isScrolling = false;

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
      isScrolling = true; // let page scroll
      return;
    } else {
      isDragging = true; // horizontal drag
    }
  }

  if (isDragging) {
    e.preventDefault();
    targetX = prevX + deltaX;
  }
}, { passive: false });

slider.addEventListener("touchend", () => {
  isDown = false;
  isDragging = false;
  isScrolling = false;
});

/* -----------------------
   ⬅️➡️ ARROW BUTTONS
----------------------- */
function slideBy(amount) {
  const maxTranslate = 0;
  const minTranslate = -(slider.scrollWidth - slider.parentElement.offsetWidth);

  targetX += amount;

  if (targetX > maxTranslate) targetX = maxTranslate;
  if (targetX < minTranslate) targetX = minTranslate;
}

const card = slider.querySelector(".card-products-home");
const cardWidth = card ? card.offsetWidth + 48 : 433;

leftArrow.addEventListener("click", () => {
  slideBy(cardWidth);
});

rightArrow.addEventListener("click", () => {
  slideBy(-cardWidth);
});
