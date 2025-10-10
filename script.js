// ----------------------------
// Cart Utilities
// ----------------------------
const CART_KEY = "pc_cart";

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}
function updateCartBadge() {
  const count = loadCart().reduce((sum, i) => sum + i.qty, 0);
  document.querySelectorAll(".cart-count").forEach(el => (el.textContent = count));
}

// ----------------------------
// Add to Cart
// ----------------------------
function addToCart(id, name, price, qty = 1) {
  const cart = loadCart();
  const found = cart.find(i => i.id === id);
  if (found) {
    found.qty += qty;
  } else {
    cart.push({ id, name, price: parseFloat(price), qty });
  }
  saveCart(cart);
  alert(`${name} added to cart!`);
}

// ----------------------------
// Render Cart Page
// ----------------------------
function renderCart() {
  const cartArea = document.getElementById("cart-area");
  if (!cartArea) return;

  const cart = loadCart();
  if (!cart.length) {
    cartArea.innerHTML = `<p class="small">Cart is empty. Add items from the shop.</p>`;
    document.getElementById("checkoutBtn")?.style.setProperty("display", "none");
    return;
  }

  let rows = `
    <table class="table">
      <thead>
        <tr>
          <th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th><th>Action</th>
        </tr>
      </thead>
      <tbody>
  `;

  let total = 0;
  cart.forEach(item => {
    const sub = item.price * item.qty;
    total += sub;
    rows += `
      <tr>
        <td>${item.name}</td>
        <td>Rs. ${item.price.toLocaleString()}</td>
        <td>${item.qty}</td>
        <td>Rs. ${sub.toLocaleString()}</td>
        <td><button class="btn btn-delete" data-id="${item.id}">Remove</button></td>
      </tr>
    `;
  });

  rows += `
      </tbody>
    </table>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px">
      <div><strong>Total:</strong> Rs. ${total.toLocaleString()}</div>
      <div>
        <button id="clearCart" class="btn secondary">Clear Cart</button>
        <a href="checkout.html" class="btn" id="checkoutBtn">Proceed to Checkout</a>
      </div>
    </div>
  `;

  cartArea.innerHTML = rows;

  // Remove item
  document.querySelectorAll(".btn-delete").forEach(btn => {
    btn.addEventListener("click", () => {
      removeItem(btn.dataset.id);
    });
  });

  // Clear cart
  document.getElementById("clearCart")?.addEventListener("click", () => {
    localStorage.removeItem(CART_KEY);
    renderCart();
    updateCartBadge();
  });
}

// ----------------------------
// Remove Item
// ----------------------------
function removeItem(id) {
  let cart = loadCart().filter(i => i.id !== id);
  saveCart(cart);
  renderCart();
}

// ----------------------------
// Checkout Page
// ----------------------------
function bindCheckoutForm() {
  const form = document.getElementById("checkoutForm");
  if (!form) return;

  const cart = loadCart();
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const summary = document.getElementById("orderSummary");
  if (summary) summary.textContent = `Order total: Rs. ${total.toLocaleString()}`;

  const orderJson = document.getElementById("order_json");
  if (orderJson) orderJson.value = JSON.stringify(cart);

  const orderTotal = document.getElementById("order_total");
  if (orderTotal) orderTotal.value = total;

  form.addEventListener("submit", e => {
    e.preventDefault();
    localStorage.removeItem(CART_KEY);
    window.location.href = "order_success.html";
  });
}

// ----------------------------
// DOM Ready
// ----------------------------
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  renderCart();
  bindCheckoutForm();

  // Add-to-cart buttons
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      addToCart(btn.dataset.id, btn.dataset.name, btn.dataset.price);
    });
  });

  // Year in footer
  const yEl = document.getElementById("year");
  if (yEl) yEl.textContent = new Date().getFullYear();
});
