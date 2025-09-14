import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import el1 from '../assets/images/el-1.png';
import el2 from '../assets/images/el-2.png';
import el3 from '../assets/images/el-3.png';
import el4 from '../assets/images/el-4.png';
import chocoimage from '../assets/images/choco 1.png'
import chocoimage2 from '../assets/images/vanila-c.png'
gsap.registerPlugin(ScrollTrigger);
const wordContainer = document.querySelector('.word-container');
const words = ["WILDER", "DARKIER", "DEEPER", "HOTTIER"];

let index = 0;
let currentWord = document.createElement('span');
currentWord.className = 'word';
currentWord.textContent = words[index];
wordContainer.innerHTML = ''; // clear any extra content
wordContainer.appendChild(currentWord);

function animateText() {
  const nextIndex = (index + 1) % words.length;

  const newWord = document.createElement('span');
  newWord.className = 'word';
  newWord.textContent = words[nextIndex];
  wordContainer.appendChild(newWord);

  gsap.set(newWord, { y: '100%' });

  const tl = gsap.timeline({
    onComplete: () => {
      // Cleanup and prepare for next
      if (currentWord && currentWord.parentNode) {
        currentWord.remove();
      }
      currentWord = newWord;
      index = nextIndex;
    }
  });

  tl.to(currentWord, {
    y: '-150%',
    duration: 0.6,
    ease: 'power3.inOut'
  }, 0);

  tl.to(newWord, {
    y: '0%',
    duration: 0.6,
    ease: 'power3.inOut'
  }, 0);
}

// Optional: Prevent duplicate intervals in SPA
if (!window.__textAnimateIntervalSet__) {
  window.__textAnimateIntervalSet__ = true;
  setInterval(animateText, 2000);
}



const flavorData = {
  strawbae: {
    bgColor: 'linear-gradient(to right bottom, #d7362e, #df4941, #e65a53, #ed6b65, #f27b77)',
    elements: [
       el1,
    el2,
    el3,
    el4
    ]
  },
  darkdesire: {
    bgColor: 'linear-gradient(to right bottom, #2e120c, #3b1c12, #4a2518, #582f1f, #663926)',
    elements: [
    
      el1,
   el2,
    el3,
    
    
      chocoimage,
   
    ]
  },
  vanilla: {
    bgColor: 'linear-gradient(to right bottom, #eabf54, #f2c86d, #f9d187, #feda9f, #ffe3b8)',
   elements: [
      el1,
   el2,
    el3,
    
    
      chocoimage2,
    ]
  }
};







const btns = document.querySelectorAll('.btn-s');

const bgBlob = document.querySelector('.bg-blob');
const elImgs = document.querySelectorAll('.elements div img');

btns.forEach(btn => {
  btn.addEventListener('click', () => {
    const flavor = btn.dataset.flavor;
    const data = flavorData[flavor];
    if (!data) return;

    const tl = gsap.timeline();

    // Animate chocolate scale out
  

    // Animate elements out
    tl.to(elImgs, {
      y: 30,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out',
      stagger: 0.05
    }, '<');

    // Animate bg-blob scale out before changing color
    tl.to(bgBlob, {
      scale: 0,
      duration: 0.8,
      ease: 'power2.inOut'
    }, '<');

    // Change content mid-animation
    tl.add(() => {
      // Removed: imageChoco.src = data.image;
      elImgs.forEach((img, i) => {
        img.src = data.elements[i];
      });
      bgBlob.style.backgroundImage = data.bgColor;
    });

    // Animate blob back in
    tl.to(bgBlob, {
      scale: 1,
      duration: 0.5,
      ease: 'power1.inOut'
    });

    // Animate chocolate back in from scale 0
   

    // Animate elements back in
    tl.to(elImgs, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
      stagger: 0.1
    }, '<');
  });
});







const strawberryBtn = document.getElementById('strawbae1');
const darkDesireBtn = document.getElementById('darkdesire2');
const vanillaBtn = document.getElementById('vanilla3');

const strawberryImg = document.querySelector('.stawb-position');
const darkDesireImg = document.querySelector('.dark-position');
const vanillaImg = document.querySelector('.vanilla-position');

// Set strawberry as default active
gsap.set(strawberryImg, {
  x: 0,
  rotate: -20,
  zIndex: 3,
  opacity: 1,
});

gsap.set([darkDesireImg, vanillaImg], {
  x: '200%',
  rotate: 50,
  zIndex: 1,
  opacity: 0.3,
});

function showChocoFlavor(activeImg, ...inactiveImgs) {
  // Animate active image
  gsap.to(activeImg, {
    x: 0,
    rotate: -20,
    zIndex: 3,
    opacity: 1,
    duration: 0.6,
    ease: 'power3.out',
  });

  // Animate all inactive
  inactiveImgs.forEach(img => {
    gsap.to(img, {
      x: '200%',
      rotate: 30,
      zIndex: 1,
      opacity: 0.3,
      duration: 0.6,
      ease: 'power3.out',
    });
  });
}

strawberryBtn.addEventListener('click', () => {
  showChocoFlavor(strawberryImg, darkDesireImg, vanillaImg);
});

darkDesireBtn.addEventListener('click', () => {
  showChocoFlavor(darkDesireImg, strawberryImg, vanillaImg);
});

vanillaBtn.addEventListener('click', () => {
  showChocoFlavor(vanillaImg, strawberryImg, darkDesireImg);
});

// Create floating animations with GSAP and store them
const chocoFloat = gsap.to(".choco-m-1", {
  y: -40,
  duration: 3.5,
  repeat: -1,
  yoyo: true,
  stagger: 0.1,
  ease: "power2.inOut",
});

const elementFloat = gsap.to(".element-m", {
  y: -20,
  duration: 1.5,
  repeat: -1,
  yoyo: true,
  stagger: 0.4,
  ease: "power2.inOut",
});

// Create scroll-triggered timeline
const chocolateFLy = gsap.timeline({
  scrollTrigger: {
    trigger: ".hero-section",
    start: "center center",
    end: "80% center",
    scrub: 1,
 
    onEnter: () => {
      chocoFloat.pause();
      elementFloat.pause();
    },
    onLeaveBack: () => {
      chocoFloat.play();
      elementFloat.play();
    },
  },
});

// Scroll-based animation
chocolateFLy.to("#choco-m-2", {
  transform: "rotate(15deg) translateY(-50%) translateX(50%)",
  duration: 3.5,
  stagger: 0.1,
  ease: "power2.inOut",
}, "0");

chocolateFLy.to("#choco-m-3", {
  transform: "rotate(-15deg) translateY(-50%) translateX(-50%)",
  duration: 3.5,
  stagger: 0.1,
  ease: "power2.inOut",
}, "0");

chocolateFLy.to("#choco-m-1", {
  transform: "translateY(-50%)",
  duration: 3.5,
  stagger: 0.1,
  ease: "power2.inOut",
}, "0");
