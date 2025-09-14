const openCartBtn = document.querySelector('#open-cart');
const closeCartBtn = document.querySelector('#close-cart');
const cart = document.querySelector('.cart-section-side');

openCartBtn.addEventListener('click', () => {
  cart.classList.add('active');
});

closeCartBtn.addEventListener('click', () => {
  cart.classList.remove('active');
});
