import gsap from "gsap";

const container = document.querySelector(".container-slide");
const slides = document.querySelectorAll(".slide-product");
const btnLeft = document.querySelector(".left-slide");
const btnRight = document.querySelector(".right-slide");
const chocolateSlider = document.querySelector(".chocolate-slider-top-bottom");
const elements = document.querySelectorAll(".elements-slider-1 .ele-ing");

let currentIndex = 0;
const totalSlides = slides.length;

function updateButtons() {
  btnLeft.style.pointerEvents = currentIndex === 0 ? "none" : "auto";
  btnLeft.style.opacity = currentIndex === 0 ? "0.3" : "1";

  btnRight.style.pointerEvents = currentIndex === totalSlides - 1 ? "none" : "auto";
  btnRight.style.opacity = currentIndex === totalSlides - 1 ? "0.3" : "1";
}

function animateElements(index) {
  elements.forEach((el, i) => {
    const randomX = gsap.utils.random(-50, 50);
    const randomY = gsap.utils.random(-30, 30);
    const randomRot = gsap.utils.random(-15, 15);

    gsap.to(el, {
      x: randomX * index,
      y: randomY * index,
      rotation: randomRot * index,
      scale: 1 + index * 0.05,
      duration: 1,
      ease: "power3.out",
    });
  });
}

function animateSlider() {
  const offsetY = 100 - currentIndex * 100;

  gsap.to(chocolateSlider, {
    y: `${offsetY}vh`,
    duration: 0.8,
    ease: "power2.inOut",
  });

  gsap.to(container, {
    x: `${-100 * currentIndex}vw`,
    duration: 0.8,
    ease: "power2.inOut",
  });

  animateElements(currentIndex);
  updateButtons();
}

btnRight.addEventListener("click", () => {
  if (currentIndex < totalSlides - 1) {
    currentIndex++;
    animateSlider();
  }
});

btnLeft.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    animateSlider();
  }
});

// Initial setup
updateButtons();
animateElements(0);




// Select all chocolate image wrappers
const chocoImgs = document.querySelectorAll(".choco-main-lr img");

// Apply floating animation to each image
chocoImgs.forEach((img, i) => {
  gsap.to(img, {
    y: 20,
    duration: 2 + i * 0.5, // Slightly different durations for variation
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
    stagger: 0.1,
  });
});
