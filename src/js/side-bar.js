// Make sure GSAP is loaded
// <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
import gsap from "gsap";
const menuBtn = document.querySelector('.menu');
const closeBtn = document.querySelector('.close-btn');
const slideBar = document.querySelector('.slide-bar');

// Optional: set initial position with GSAP
gsap.set(slideBar, { x: '150%' });

menuBtn.addEventListener('click', () => {
  gsap.to(slideBar, {
    x: '0%',
    duration: 0.9,
    ease: 'power2.out'
  });
  gsap.to(".box", {
  scale: 1,
    duration: 0.9,
    stagger: 0.1,
    ease: 'power2.out'
  });
    gsap.to(".menu-2 a", {
  scale: 1,
    duration: 0.9,
    stagger: 0.1,
    ease: 'power2.out'
  });
});

closeBtn.addEventListener('click', () => {
  gsap.to(slideBar, {
    x: '150%',
    duration: 0.9,
    ease: 'power2.in'
  });
   gsap.to(".box", {
  scale: 0,
    duration: 0.9,
    stagger: 0.1,
    ease: 'power2.out'
  });
    gsap.to(".menu-2 a", {
  scale: 0,
    duration: 0.9,
    stagger: 0.1,
    ease: 'power2.out'
  });
});
