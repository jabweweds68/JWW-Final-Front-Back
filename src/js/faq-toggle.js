import gsap from "gsap";
document.addEventListener("DOMContentLoaded", () => {
  const faqs = document.querySelectorAll(".faq");

  faqs.forEach(faq => {
    const toggleBtn = faq.querySelector(".toggle-btn-faq");
    const content = faq.querySelector(".faq-content");
    const icon = toggleBtn.querySelector("img");
    const heading = faq.querySelector(".bar-f h1");
    const paragraph = content.querySelector("p");

    if (!toggleBtn || !content) return;

    // Initial setup
    gsap.set(content, { height: 0, opacity: 0, overflow: "hidden", display: "none" });
    gsap.set(icon, { rotate: 0 });
    gsap.set(faq, { borderRadius: "20rem", backgroundColor: " #FFF7DD;" });
    gsap.set(toggleBtn, { backgroundColor: "#FFF7DD;" });
    gsap.set([heading, paragraph], { color: "#934919" });

    toggleBtn.addEventListener("click", () => {
      const isOpen = faq.classList.contains("open");

      if (isOpen) {
        // Collapse current
        const currentHeight = content.scrollHeight;

        const tlClose = gsap.timeline({
          defaults: { duration: 0.4, ease: "power2.inOut" },
          onComplete: () => {
            faq.classList.remove("open");
            gsap.set(content, { display: "none", height: 0, opacity: 0 });
          }
        });

        tlClose
          .fromTo(content, { height: currentHeight, opacity: 1 }, { height: 0, opacity: 0 })
          .to(icon, { rotate: 0 }, "<")
          .set(faq, { borderRadius: "20rem" }, "<") // Immediate radius reset
          .to(faq, { backgroundColor: " #FFF7DD" }, "<")
          .to(toggleBtn, { backgroundColor: " #FFF7DD" }, "<")
          .to([heading, paragraph], { color: "#934919" }, "<");

      } else {
        // Collapse all others
        faqs.forEach(otherFaq => {
          if (otherFaq !== faq && otherFaq.classList.contains("open")) {
            const otherContent = otherFaq.querySelector(".faq-content");
            const otherIcon = otherFaq.querySelector(".toggle-btn-faq img");
            const otherHeading = otherFaq.querySelector(".bar-f h1");
            const otherParagraph = otherContent.querySelector("p");
            const otherToggleBtn = otherFaq.querySelector(".toggle-btn-faq");
            const otherHeight = otherContent.scrollHeight;

            const tlOtherClose = gsap.timeline({
              defaults: { duration: 0.4, ease: "power2.inOut" },
              onComplete: () => {
                otherFaq.classList.remove("open");
                gsap.set(otherContent, { display: "none", height: 0, opacity: 0 });
                gsap.set(otherFaq, { borderRadius: "20rem", backgroundColor: " #FFF7DD;" });
                gsap.set(otherIcon, { rotate: 0 });
                gsap.set(otherToggleBtn, { backgroundColor: " #FFF7DD;" });
                gsap.set([otherHeading, otherParagraph], { color: "#934919" });
              }
            });

            tlOtherClose
              .fromTo(otherContent, { height: otherHeight, opacity: 1 }, { height: 0, opacity: 0 })
              .to(otherIcon, { rotate: 0 }, "<")
              .set(otherFaq, { borderRadius: "20rem" }, "<")
              .to(otherFaq, { backgroundColor: " #FFF7DD" }, "<")
              .to(otherToggleBtn, { backgroundColor: "#FFF7DD" }, "<")
              .to([otherHeading, otherParagraph], { color: "#934919" }, "<");
          }
        });

        // Expand selected
        faq.classList.add("open");
        gsap.set(content, { display: "block", overflow: "hidden" });
        const fullHeight = content.scrollHeight;

        const tlOpen = gsap.timeline({
          defaults: { duration: 0.4, ease: "power2.out" },
          onComplete: () => {
            gsap.set(content, { height: "auto", overflow: "visible" });
          }
        });

        tlOpen
          .set(faq, { borderRadius: "1rem" }, 0) // Instant radius change
          .fromTo(content, { height: 0, opacity: 0 }, { height: fullHeight, opacity: 1 }, 0)
          .to(faq, { backgroundColor: "#552716" }, "<")
          .to(toggleBtn, { backgroundColor: "#FFF7DD" }, "<")
          .to(icon, { rotate: 45 }, "<")
          .to([heading, paragraph], { color: "#FFF7DD" }, "<");
      }
    });
  });
});
