import gsap from "gsap";
import Draggable from "gsap/Draggable";
import InertiaPlugin from "gsap/InertiaPlugin";

gsap.registerPlugin(Draggable, InertiaPlugin);

window.addEventListener("load", () => {
  const track = document.getElementById("cardTrack");
  const cards = document.querySelectorAll(".card-review");
  const leftBtn = document.querySelector(".pagination-btn .left");
  const rightBtn = document.querySelector(".pagination-btn .right");

  const rotations = [];

  const [draggableInstance] = Draggable.create(track, {
    type: "x",
    edgeResistance: 1,
    bounds: ".review-section-container",
    inertia: true,
    onPress: () => {
      applyRandomRotation();
    },

    onRelease: () => {
      resetCardRotation();
    }
  });

  const scrollAmount = 400;

  rightBtn.addEventListener("click", () => {
    applyRandomRotation();

    // Clamp new X position within draggable bounds
    let newX = draggableInstance.x - scrollAmount;
    if (newX < draggableInstance.minX) newX = draggableInstance.minX;

    gsap.to(track, {
      x: newX,
      duration: 0.6,
      ease: "power2.inOut",
      onUpdate: () => draggableInstance.update(),
      onComplete: () => resetCardRotation()
    });
  });

  leftBtn.addEventListener("click", () => {
    applyRandomRotation();

    // Clamp new X position within draggable bounds
    let newX = draggableInstance.x + scrollAmount;
    if (newX > draggableInstance.maxX) newX = draggableInstance.maxX;

    gsap.to(track, {
      x: newX,
      duration: 0.6,
      ease: "power2.inOut",
      onUpdate: () => draggableInstance.update(),
      onComplete: () => resetCardRotation()
    });
  });

  function applyRandomRotation() {
    cards.forEach((card, index) => {
     

      gsap.to(card, {
 
        duration: 0.3,
        ease: "power2.out"
      });
    });
  }

  function resetCardRotation() {
    cards.forEach((card) => {
      gsap.to(card, {
        rotate: 0,
        duration: 0.5,
        ease: "power3.out"
      });
    });
    rotations.length = 0;
  }

  // Ensure bounds are correct when resizing window
  window.addEventListener("resize", () => {
    draggableInstance.applyBounds();
  });
});
