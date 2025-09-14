import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);


// Define your custom colors

const middleColor = "#42f5e9";  // Middle color
const endColor = "#f5e942";     // End color

// GSAP timeline with ScrollTrigger
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".horizontal-scroll-animation",
    start: "top top",
    end: "+=400%",       // Stick for 3x viewport height
    scrub: 1,
    markers: true,
    pin: true,
    anticipatePin: 1,
  }
});

// Move the container horizontally
tl.to(".main-slide-horizontal", {
  x: "-200vw",
 duration: 1,
  ease: "none",
}, 0);

// Color transition 1: Start → Middle
tl.to(".text-bg", {
  color: "#934919",
  ease: "none",
  backgroundColor: "#552716",
}, 0); // ≈ 1/3 of scroll
tl.to(".text-bg", {
  color: "#FFF7DD",
  ease: "none",
  backgroundColor: "#F27B75",
}, 0.5); // ≈ 1/3 of scroll
tl.to(".chocolate-horizontal", {
  ease: "none",
  stagger: 0.3,
x: "-50vw",
}, 0); // ≈ 1/3 of scroll
tl.to(".element-horizontal", {
  ease: "none",
  stagger: 0.5,
x: "-50vw",
}, 0.2); // ≈ 1/3 of scroll




// Color transition 2: Middle → End
// tl.to(".text-bg", {
//   color: endColor,
//   ease: "none"
// }, 0.01); // ≈ 2/3 of scroll

