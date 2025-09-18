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
    end: "+=400%",     // Stick for 4x viewport height
    scrub: 1,
    pin: true,
    anticipatePin: 1,
    invalidateOnRefresh: true, // 🔥 recalc when layout changes
  }
});

// Move the container horizontally
tl.to(".main-slide-horizontal", {
  x: "-200vw",
  duration: 1,
  ease: "none",
}, 0);

// Color transitions
tl.to(".text-bg", {
  color: "#934919",
  backgroundColor: "#552716",
  ease: "none"
}, 0);

tl.to(".text-bg", {
  color: "#FFF7DD",
  backgroundColor: "#F27B75",
  ease: "none"
}, 0.5);

tl.to(".chocolate-horizontal", {
  x: "-50vw",
  ease: "none",
  stagger: 0.3,
}, 0);

tl.to(".element-horizontal", {
  x: "-50vw",
  ease: "none",
  stagger: 0.5,
}, 0.2);

// ✅ Refresh ScrollTrigger after all content (like images) is loaded
window.addEventListener("load", () => {
  ScrollTrigger.refresh();
});
