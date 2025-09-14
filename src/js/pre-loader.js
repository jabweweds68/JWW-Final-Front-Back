import gsap from "gsap";


// Get screen width and user agent

const preloader = gsap.timeline();
gsap.set(".right-hand", { x: "100%" }); // or some negative offset
gsap.set(".left-hand", { x: "-100%" });


preloader.to(".bar-number-fill", {
  width: "100%",
  duration: 3,
  ease: "power4.inOut",
});

let counterObj = { value: 0 };
preloader.to(counterObj, {
  value: 100,
  duration: 2,
  ease: "power1.out",
  onUpdate: () => {
    document.querySelector(".numbr-loader").textContent =
      `${Math.round(counterObj.value)}%`;
  }
}, 0); // start at the same time as bar fill

preloader.to(".right-hand", {
    x: 0,
    duration: 4,
    ease: "power4.inOut",
},"0")
preloader.to(".left-hand", {
     x: 0,
    duration: 4,
    ease: "power4.inOut",
},"1")


preloader.to(".right-hand", {
   x: "100%",
    duration: 4,
    ease: "power4.inOut",
},"5")
preloader.to(".left-hand", {
     x: "-100%",
    duration: 4,
    ease: "power4.inOut",
},"5")

preloader.to(".bg-right", {
   x: "100%",
    duration: 4,
    ease: "power4.inOut",
},"5")
preloader.to(".bg-left", {
     x: "-100%",
    duration: 4,
    ease: "power4.inOut",
},"5")


preloader.to(".pre-loader-container", {
 opacity: 0,
 display: "none",
    duration: 0.6,
    ease: "power3.out",
 
}, "6");



// Function to split text into spans per letter
// Animate


preloader.to(".content-left ", {
  y: 0,
  opacity: 1,
  duration: 0.6,
  ease: "power3.out",
  stagger: 0.02
},"0");




preloader.to(".content-left", {
opacity: 0,
y: 50,

},"5")
