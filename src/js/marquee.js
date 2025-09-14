const carouselElements = document.querySelectorAll(".splide");

  // Iterate through each carousel element
  carouselElements.forEach((carouselElement) => {
    // Initialize a new Splide instance for each carousel
    const splide = new Splide(carouselElement, {
      type: "loop",
      drag: false,
      autoWidth: true,
      gap: 35,
      pagination: false,
      arrows: false,
      autoScroll: {
        speed: 1,
        pauseOnHover: false,
      },
    });

    // Mount the Splide instance
    splide.mount(window.splide.Extensions);
  });