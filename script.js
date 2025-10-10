  // assets/js/script.js
document.addEventListener('DOMContentLoaded', () => {
  updateYear();
  initCartButtons();
  renderCart();
  bindCheckoutForm();
});

function updateYear(){
  const yEl = document.getElementById('year');
  if(yEl) yEl.textContent = new Date().getFullYear();
}

function getCart(){
  try {
    return JSON.parse(localStorage.getItem('pc_cart') || '{}');
  } catch(e){ return {}; }
}
function saveCart(cart){
  localStorage.setItem('pc_cart', JSON.stringify(cart));
  updateCartCount();
}
function updateCartCount(){
  const cart = getCart();
  let count = 0;
  for(let k in cart) count += cart[k];
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
}

function initCartButtons(){
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.dataset.id;
      const qty = 1;
      addToCart(id, qty);
      alert('Added to cart');
    });
  });
}

function addToCart(id, qty=1){
  const cart = getCart();
  cart[id] = (cart[id] || 0) + qty;
  saveCart(cart);
}

function renderCart(){
  const cartArea = document.getElementById('cart-area');
  if(!cartArea) return;
  const cart = getCart();
  if(Object.keys(cart).length === 0){
    cartArea.innerHTML = '<p class="small">Cart is empty. Add items from the shop.</p>';
    document.getElementById('checkoutBtn')?.style.display = 'none';
    return;
  }function renderCart() {
  const cartArea = document.getElementById('cart-area');
  if (!cartArea) return;

  const cart = getCart();

  if (Object.keys(cart).length === 0) {
    cartArea.innerHTML = '<p class="small">Cart is empty. Add items from the shop.</p>';
    document.getElementById('checkoutBtn')?.style.display = 'none';
    return;
  }

  // If cart has items
  let cartHTML = "<ul>";
  let total = 0;

  for (const id in cart) {
    const item = cart[id];
    total += item.price * item.quantity;

    cartHTML += `
      <li>
        ${item.name} - Rs. ${item.price} × ${item.quantity} = Rs. ${item.price * item.quantity}
      </li>
    `;
  }

  cartHTML += "</ul>";
  cartHTML += `<p><strong>Total: Rs. ${total}</strong></p>`;

  cartArea.innerHTML = cartHTML;

  // Show checkout button
  document.getElementById('checkoutBtn')?.style.display = 'block';
}
  // Simple product data map (must match static files)
  const products = {
    "1": {name:"Prestige Silver Watch", price:129.99},
    "2": {name:"Luxe Bracelet", price:49.50},
    "3": {name:"Aurum Perfume", price:79.00}
  };
  let rows = '<table class="table"><thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th><th>Action</th></tr></thead><tbody>';
  let total = 0;
  for(let id in cart){
    const p = products[id];
    const qty = cart[id];
    const sub = p.price * qty;
    total += sub;
    rows += `<tr><td>${p.name}</td><td>$${p.price.toFixed(2)}</td><td>${qty}</td><td>$${sub.toFixed(2)}</td><td><a href="#" class="btn btn-delete" data-id="${id}">Remove</a></td></tr>`;
  }
  rows += `</tbody></table><div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px"><div><strong>Total:</strong> $${total.toFixed(2)}</div><div><a href="#" id="clearCart" class="btn secondary">Clear Cart</a> <a href="checkout.html" class="btn">Proceed to Checkout</a></div></div>`;
  cartArea.innerHTML = rows;
  document.getElementById('clearCart')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('pc_cart');
    renderCart();
    updateCartCount();
  });
  document.querySelectorAll('.btn-delete').forEach(b => b.addEventListener('click', (e) => {
    e.preventDefault();
    const id = b.dataset.id;
    const cart = getCart();
    delete cart[id];
    saveCart(cart);
    renderCart();
  }));
  
}


function bindCheckoutForm(){
  const form = document.getElementById('checkoutForm');
  if(!form) return;
  const orderSummary = document.getElementById('orderSummary');
  const cart = getCart();
  let total = 0;
  const prices = {"1":129.99,"2":49.50,"3":79.00};
  for(let id in cart) total += cart[id]*prices[id];
  orderSummary.textContent = 'Order total: $' + total.toFixed(2);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // simulate order placement
    localStorage.removeItem('pc_cart');
    window.location.href = 'order_success.html';
    
  });
  
  
}

// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Update counter on page load
function updateCartCount() {
  document.getElementById("cartCount").innerText = cart.length;
}
updateCartCount();

// Add to Cart button click
document.querySelectorAll(".add-to-cart").forEach(btn => {
  btn.addEventListener("click", () => {
    const name = btn.getAttribute("data-name");
    const price = btn.getAttribute("data-price");

    // Add product to cart
    cart.push({ name, price });
    localStorage.setItem("cart", JSON.stringify(cart));

    // Update counter
    updateCartCount();

    alert(`${name} added to cart!`);
  });
});

// assets/js/cart.js
const CART_KEY = 'pc_cart';

function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}
function saveCart(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }

function addItem(item) {
  const cart = loadCart();
  const found = cart.find(i => i.id === item.id);
  if (found) found.qty += 1;
  else cart.push({ id: item.id, name: item.name, price: Number(item.price), img: item.img || '', qty: 1 });
  saveCart(cart);
  updateCartBadge();
}

function removeItem(id) {
  let cart = loadCart().filter(i => i.id !== id);
  saveCart(cart);
  updateCartBadge();
  renderCartIfPresent();
}

function setQty(id, qty) {
  qty = Math.max(1, Number(qty)||1);
  const cart = loadCart();
  const it = cart.find(i => i.id === id);
  if (it) it.qty = qty;
  saveCart(cart);
  updateCartBadge();
  renderCartIfPresent();
}

function countItems() { return loadCart().reduce((s,i)=>s+i.qty, 0); }
function cartTotal() { return loadCart().reduce((s,i)=>s + i.price*i.qty, 0); }

function updateCartBadge() {
  const el = document.getElementById('cartCount');
  if (el) el.textContent = countItems();
}


// Click handler for all "Add to Cart" buttons (event delegation)
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.add-to-cart');
  if (!btn) return;
  addItem({
    id: btn.dataset.id,
    name: btn.dataset.name,
    price: btn.dataset.price,
    img: btn.dataset.img
  });
});

// Render cart table if #cart-area exists
function renderCartIfPresent() {
  const mount = document.getElementById('cart-area');
  if (!mount) return;

  const cart = loadCart();
  if (!cart.length) {
    mount.innerHTML = `<p class="small">Cart is empty. Add items from the shop.</p>`;
    const ck = document.getElementById('checkoutBtn');
    if (ck) ck.style.display = 'none';
    return;
  }

  let html = `
    <div class="table">
      <div class="row head"><div>Item</div><div>Price</div><div>Qty</div><div>Subtotal</div><div></div></div>
  `;
  cart.forEach(it => {
    html += `
      <div class="row">
        <div class="cell"><img src="${it.img}" alt="" style="width:48px;height:48px;object-fit:cover;margin-right:8px;vertical-align:middle;border-radius:8px"> ${it.name}</div>
        <div class="cell">PKR ${it.price.toLocaleString()}</div>
        <div class="cell">
          <input type="number" min="1" value="${it.qty}" data-qty-id="${it.id}" class="qty-input">
        </div>
        <div class="cell">PKR ${(it.price * it.qty).toLocaleString()}</div>
        <div class="cell"><button class="link danger" data-remove-id="${it.id}">Remove</button></div>
      </div>
    `;
  });
  html += `
      <div class="row foot"><div></div><div></div>
        <div class="cell"><strong>Total</strong></div>
        <div class="cell"><strong>PKR ${cartTotal().toLocaleString()}</strong></div>
        <div></div>
      </div>
    </div>
  `;

  mount.innerHTML = html;
  const ck = document.getElementById('checkoutBtn');
  if (ck) ck.style.display = 'inline-block';
}

// Listeners for qty changes / remove buttons
document.addEventListener('input', (e) => {
  const inp = e.target.closest('input.qty-input');
  if (!inp) return;
  setQty(inp.dataset.qtyId, inp.value);
});
document.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-remove-id]');
  if (!btn) return;
  removeItem(btn.dataset.removeId);
});


// On every page load
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  renderCartIfPresent();

  // Checkout hand-off: if we are on checkout page, fill summary + hidden JSON
  if (document.getElementById('checkoutForm')) {
    const items = loadCart();
    const total = cartTotal();
    const summary = document.getElementById('orderSummary');
    if (summary) summary.textContent = `Order total: PKR ${total.toLocaleString()} (${countItems()} item${countItems()!==1?'s':''})`;
// --- Cart storage in localStorage ---
const CART_KEY = "pc_cart";

function loadCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
function countItems() {
  return loadCart().reduce((sum, item) => sum + item.qty, 0);
}
function updateCartBadge() {
  const el = document.getElementById("cartCount");
  if (el) el.textContent = countItems();
}

// --- Add to Cart handler ---
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-to-cart");
  if (!btn) return;

  const id = btn.dataset.id;
  const name = btn.dataset.name;
  const price = parseFloat(btn.dataset.price);

  let cart = loadCart();
  const found = cart.find(p => p.id === id);
  if (found) {
    found.qty += 1;
  } else {
    cart.push({ id, name, price, qty: 1 });
  }
  saveCart(cart);
  updateCartBadge();

  alert(`${name} added to cart!`);
});

// --- Initialize badge on page load ---
document.addEventListener("DOMContentLoaded", updateCartBadge);

    // Hidden fields for PHP
    const jsonField = document.getElementById('order_json');
    const totalField = document.getElementById('order_total');
    if (jsonField) jsonField.value = JSON.stringify(items);
    if (totalField) totalField.value = total;
  }
});

