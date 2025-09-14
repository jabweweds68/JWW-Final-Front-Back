import"./modulepreload-polyfill-B5Qt9EMX.js";import"./cart-manager-BtI-k1Ka.js";import"./marquee-27CAOdvs.js";const a={adminWhatsApp:"+923111246705",companyName:"JWW Chocolates",currency:"PKR",deliveryCharge:250,apiBaseUrl:"https://jww-backend-main-production.up.railway.app",emailJS:{publicKey:"1RkfeMikntWtXPQjS",serviceId:"service_dfpatsi",templateId:"template_implh0e"}};let i=[];function p(){try{const e=localStorage.getItem("jww_cart");i=e?JSON.parse(e):[]}catch(e){console.error("Error loading cart:",e),i=[]}}function y(){const e=document.getElementById("checkout-cart-items"),t=document.getElementById("checkout-products-total"),r=document.getElementById("checkout-subtotal");if(i.length===0){e.innerHTML='<div class="empty-cart">Your cart is empty. <a href="./index.html">Continue Shopping</a></div>',t.textContent="0",r.textContent="250";return}e.innerHTML=i.map(o=>`
        <div class="cart-products">
            <div class="right-content-ct">
                <div class="image-cart-p">
                    <img src="${o.image}" alt="${o.name}" onerror="this.src='./assets/images/ABout-pic.png'">
                </div>
                <div class="content-cart-product">
                    <div class="name-p">${o.name}</div>
                    <div class="p-size-cart">${o.size?o.size.charAt(0).toUpperCase()+o.size.slice(1):"Regular"} - ${o.boxCount} Box${o.boxCount>1?"es":""}</div>
                    <div class="price-p">PKR: ${o.totalPrice*o.quantity}</div>
                </div>
            </div>
            <div class="quantity-ch-num">${o.quantity}</div>
        </div>
    `).join("");const n=i.reduce((o,l)=>o+l.totalPrice*l.quantity,0),s=n+a.deliveryCharge;t.textContent=n,r.textContent=s}function m(e){const t=e.value.trim();let r=!0,n="";return e.classList.remove("error"),v(e),e.hasAttribute("required")&&!t&&(r=!1,n=`${e.placeholder} is required`),e.type==="email"&&t&&(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)||(r=!1,n="Please enter a valid email address")),e.type==="tel"&&t&&(/^[\+]?[0-9\s\-\(\)]{10,15}$/.test(t)||(r=!1,n="Please enter a valid phone number")),r||(e.classList.add("error"),f(e,n)),r}function f(e,t){const r=document.createElement("div");r.className="field-error",r.textContent=t,e.parentNode.appendChild(r)}function v(e){const t=e.parentNode.querySelector(".field-error");t&&t.remove()}function $(){const e=["email","phone","first-name","last-name","address","city","postal-code"];let t=!0;return e.forEach(r=>{const n=document.getElementById(r);n&&!m(n)&&(t=!1)}),t}async function C(e){const t={items:i.map(r=>({image:r.image||"./assets/images/ABout-pic.png",title:r.name,quantity:r.quantity,size:r.size||"Regular",price:r.totalPrice}))};try{const r=await fetch(`${a.apiBaseUrl}/Order`,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(t)});if(!r.ok)throw new Error(`HTTP error! status: ${r.status}`);const n=await r.json();if(n.success)return{success:!0,orderId:n.data._id,backendOrderId:n.data._id,totalCartPrice:n.data.totalCartPrice};throw new Error(n.message||"Failed to save order")}catch(r){return console.error("Backend API Error:",r),{success:!1,error:r.message}}}function E(){const e=Date.now().toString(36),t=Math.random().toString(36).substr(2,5);return`JWW-${e}-${t}`.toUpperCase()}async function I(e){if(typeof emailjs>"u")return console.error("EmailJS library not loaded"),!1;const t={email:e.customer.email,to_email:e.customer.email,reply_to:e.customer.email,to_name:`${e.customer.firstName} ${e.customer.lastName}`,customer_name:`${e.customer.firstName} ${e.customer.lastName}`,customer_first_name:e.customer.firstName,customer_last_name:e.customer.lastName,customer_phone:e.customer.phone,order_id:e.orderId,backend_order_id:e.backendOrderId,order_date:new Date(e.timestamp).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}),order_time:new Date(e.timestamp).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:!0}),order_items:h(e.cart),order_items_html:_(e.cart),total_items:i.reduce((r,n)=>r+n.quantity,0),delivery_address:b(e.customer),delivery_address_line1:e.customer.address,delivery_address_line2:e.customer.apartment||"",delivery_city:e.customer.city,delivery_postal_code:e.customer.postalCode,subtotal:e.totals.subtotal,delivery_charge:e.totals.delivery,total_amount:e.totals.total,currency:a.currency,company_name:a.companyName,admin_whatsapp:a.adminWhatsApp,from_name:a.companyName,payment_method:"Cash on Delivery",estimated_delivery:"2-3 working days",subject:`Order Confirmation - ${e.orderId}`,greeting:`Dear ${e.customer.firstName}`,thank_you_message:`Thank you for your order with ${a.companyName}!`,support_whatsapp:a.adminWhatsApp,support_message:"If you have any questions about your order, please contact us via WhatsApp."};try{return(await emailjs.send(a.emailJS.serviceId,a.emailJS.templateId,t)).status===200}catch(r){return console.error("EmailJS Error:",r),!1}}function h(e){return e.map((t,r)=>{const n=t.size?` (${t.size.charAt(0).toUpperCase()+t.size.slice(1)})`:"",s=t.boxCount>1?` - ${t.boxCount} Boxes`:"";return`${r+1}. ${t.name}${n}${s} x${t.quantity} = ${a.currency} ${t.totalPrice*t.quantity}`}).join(`
`)}function _(e){return e.map((t,r)=>{const n=t.size?` (${t.size.charAt(0).toUpperCase()+t.size.slice(1)})`:"",s=t.boxCount>1?` - ${t.boxCount} Boxes`:"";return`<tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${r+1}. ${t.name}${n}${s}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${t.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${a.currency} ${t.totalPrice*t.quantity}</td>
        </tr>`}).join("")}function b(e){return`${e.firstName} ${e.lastName}
${e.address}${e.apartment?`
`+e.apartment:""}
${e.city}, ${e.postalCode}
Phone: ${e.phone}`}function w(e){const t=`NEW ORDER RECEIVED
    // Frontend Order ID: ${e.orderId}
    // Backend Order ID: ${e.backendOrderId}
    
    Customer:
    ${e.customer.firstName} ${e.customer.lastName}
    email: ${e.customer.email}
    phone: ${e.customer.phone}
    Time: ${new Date().toLocaleString()}

    Delivery Address:
    ${e.customer.address}
    ${e.customer.apartment?e.customer.apartment+`
`:""}${e.customer.city}, ${e.customer.postalCode}

     Order Items:
    ${h(e.cart)}

    Total: ${a.currency} ${e.totals.total}
    Payment: Cash on Delivery`,r=`https://wa.me/${a.adminWhatsApp.replace(/\D/g,"")}?text=${encodeURIComponent(t)}`;window.open(r,"_blank")}function k(e){const t=document.createElement("div");return t.className="loading-overlay",t.innerHTML=`
        <div class="loading-content">
            <div class="spinner"></div>
            <div>${e}</div>
        </div>
    `,document.body.appendChild(t),t}function g(e){e&&e.parentNode&&e.parentNode.removeChild(e)}async function x(e){if(e&&e.preventDefault(),i.length===0){alert("Your cart is empty. Please add items before placing an order.");return}if(!$())return;const t={email:document.getElementById("email").value.trim(),phone:document.getElementById("phone").value.trim(),firstName:document.getElementById("first-name").value.trim(),lastName:document.getElementById("last-name").value.trim(),address:document.getElementById("address").value.trim(),apartment:document.getElementById("apartment").value.trim(),city:document.getElementById("city").value.trim(),postalCode:document.getElementById("postal-code").value.trim(),orderUpdates:document.getElementById("order-updates").checked,marketingUpdates:document.getElementById("marketing-updates").checked,saveInfo:document.getElementById("save-info").checked},r=E(),n=i.reduce((c,d)=>c+d.totalPrice*d.quantity,0),s=k("Processing...."),o=document.getElementById("place-order-btn"),l=o.textContent;o.textContent="Processing...",o.style.pointerEvents="none";try{const c=await C();if(!c.success)throw new Error(`Backend save failed: ${c.error}`);s.querySelector(".loading-content div:last-child").textContent="Placing your order...";const d={orderId:r,backendOrderId:c.backendOrderId,customer:t,cart:i,totals:{subtotal:n,delivery:a.deliveryCharge,total:n+a.deliveryCharge},timestamp:new Date().toISOString()},S=await I(d);w(d);const u=JSON.parse(localStorage.getItem("jww_orders")||"[]");u.unshift(d),localStorage.setItem("jww_orders",JSON.stringify(u.slice(0,50))),localStorage.removeItem("jww_cart"),g(s),document.getElementById("checkout-form").reset(),setTimeout(()=>{window.location.href="/product-page"},3e3)}catch(c){console.error("Order processing error:",c),g(s),o.textContent=l,o.style.pointerEvents="",alert(`❌ ORDER PROCESSING FAILED

Error: ${c.message}

Please check:
- Your internet connection
- Backend server is running on ${a.apiBaseUrl}
- EmailJS configuration

Try again or contact support.`)}}document.addEventListener("DOMContentLoaded",function(){typeof emailjs<"u"?emailjs.init(a.emailJS.publicKey):console.error("EmailJS library not loaded!"),p(),y();const e=document.getElementById("place-order-btn");e&&e.addEventListener("click",x);const t=document.getElementById("checkout-form");t&&t.querySelectorAll("input").forEach(n=>{n.addEventListener("blur",()=>m(n)),n.addEventListener("input",()=>{n.classList.contains("error")&&m(n)})}),window.addEventListener("storage",function(r){r.key==="jww_cart"&&(p(),y())})});
