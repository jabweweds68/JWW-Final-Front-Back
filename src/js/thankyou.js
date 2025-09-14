import "../scss/Main.scss";
import "./side-bar";
import "./marquee";

import gsap from "gsap";
document.querySelectorAll(".float-el-img").forEach((el, i) => {
  gsap.to(el, {
    y: -900,
    repeat: -1,
   stagger: 1,
   delay: i * 1,
    ease: "power1.inOut",
    duration: 10,
   
  });
});