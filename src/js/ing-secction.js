import gsap from "gsap";
window.addEventListener("load", () => {
  gsap.to(".circle-ing img", {
    rotate: 360,
    duration: 20,
    ease: "none",
    repeat: -1
  });
  gsap.to(".circle-rotate", {
  rotation: 360,
  duration: 10,
  ease: "linear",
  repeat: -1,
});

});