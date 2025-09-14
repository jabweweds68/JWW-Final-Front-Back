import "../scss/Main.scss";
import gsap from "gsap";

const daysEl = document.querySelector(".Days-count");
const hoursEl = document.querySelector(".Hours-count");
const minsEl = document.querySelector(".Mints-count");

// get the target Monday 6 PM
function getNextMonday6PM() {
  const now = new Date();
  const target = new Date();

  // set time to 6:00 PM
  target.setHours(18, 0, 0, 0);

  // find how many days to add until next Monday
  let daysToAdd = (1 + 7 - now.getDay()) % 7; // days until Monday
  if (daysToAdd === 0 && now > target) {
    daysToAdd = 7; // if it's Monday after 6 PM, go to next week
  }
  target.setDate(now.getDate() + daysToAdd);

  return target;
}

const targetDate = getNextMonday6PM();

function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    daysEl.textContent = "0";
    hoursEl.textContent = "0";
    minsEl.textContent = "0";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);

  animateNumber(daysEl, days);
  animateNumber(hoursEl, hours);
  animateNumber(minsEl, mins);
}

function animateNumber(el, newVal) {
  const oldVal = parseInt(el.textContent, 10);
  if (oldVal !== newVal) {
    gsap.to(el, {
      textContent: newVal,
      duration: 0.5,
      snap: { textContent: 1 },
      ease: "power1.inOut"
    });
  }
}

setInterval(updateCountdown, 1000);
updateCountdown();