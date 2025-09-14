
import { defineConfig } from 'vite';
export default defineConfig({
  root: 'src', // 
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: 'src/index.html',
        About: 'src/About.html',
        contact: 'src/contact.html',
        products: 'src/product-page.html',
        checkout: 'src/checkout.html',
        thankyou:'src/thankyou.html',
        dashboard:'src/Dashboard.html',
        login:'src/Login.html',
        orders:'src/Orders.html',
      }
    }
  },
});