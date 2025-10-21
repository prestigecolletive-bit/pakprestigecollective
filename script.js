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

 // ===== Page-Local Product Search (works on all pages) =====
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchBox");
  const searchBtn = document.getElementById("searchBtn");

  if (!searchInput || !searchBtn) return; // Skip if page has no search bar

  function performSearch() {
    const query = searchInput.value.toLowerCase().trim();
    const products = document.querySelectorAll(".product-card, .card.product, .product");

    products.forEach(product => {
      const text = product.innerText.toLowerCase();
      product.style.display = text.includes(query) || query === "" ? "block" : "none";
    });

    showNoResultsMessage();
  }

  function showNoResultsMessage() {
    const products = document.querySelectorAll(".product-card, .card.product, .product");
    const visible = Array.from(products).some(p => p.style.display !== "none");
    let msg = document.getElementById("no-results");

    if (!visible) {
      if (!msg) {
        msg = document.createElement("p");
        msg.id = "no-results";
        msg.textContent = "No matching products found.";
        msg.style.textAlign = "center";
        msg.style.color = "#444";
        msg.style.marginTop = "20px";
        document.querySelector(".product-grid, .product-sections, .container")?.appendChild(msg);
      }
    } else if (msg) {
      msg.remove();
    }
  }

  // Event listeners
  searchBtn.addEventListener("click", performSearch);
  searchInput.addEventListener("keyup", e => {
    if (e.key === "Enter") performSearch();
    if (searchInput.value === "") performSearch();
  });
});


  // On click 🔍 button
  searchBtn.addEventListener("click", performSearch);


  

  // On pressing Enter
  searchInput.addEventListener("keyup", e => {
    if (e.key === "Enter") performSearch();
    if (searchInput.value === "") performSearch(); // Reset when cleared
  });


   function showNoResultsMessage() {
    const visible = Array.from(document.querySelectorAll(".product, .card.product"))
      .some(p => p.style.display !== "none");
    let msg = document.getElementById("no-results");

    if (!visible) {
      if (!msg) {
        msg = document.createElement("p");
        msg.id = "no-results";
        msg.textContent = "No matching products found.";
        msg.style.textAlign = "center";
        msg.style.color = "#444";
        msg.style.marginTop = "20px";
        document.querySelector(".product-sections, .container")?.appendChild(msg);
      }
    } else if (msg) {
      msg.remove();
    }
  }
  


  

  // Update search handler
  function performSearch() {
    const query = searchInput.value.toLowerCase().trim();
    const products = document.querySelectorAll(".product, .card.product");

    products.forEach(product => {
      const text = product.innerText.toLowerCase();
      product.style.display = text.includes(query) || query === "" ? "block" : "none";
    });

    showNoResultsMessage();
  }
  // ===== Simple On-Page Search (works on each page) =====
const searchInput = document.getElementById("searchBox");
const searchBtn = document.getElementById("searchBtn");

if (searchInput && searchBtn) {
  function performSearch() {
    const query = searchInput.value.toLowerCase().trim();
    const products = document.querySelectorAll(".product, .card.product");

    products.forEach(product => {
      const text = product.innerText.toLowerCase();
      product.style.display = text.includes(query) || query === "" ? "block" : "none";
    });

    showNoResultsMessage();
  }

  function showNoResultsMessage() {
    const visible = Array.from(document.querySelectorAll(".product, .card.product"))
      .some(p => p.style.display !== "none");
    let msg = document.getElementById("no-results");

    if (!visible) {
      if (!msg) {
        msg = document.createElement("p");
        msg.id = "no-results";
        msg.textContent = "No matching products found.";
        msg.style.textAlign = "center";
        msg.style.color = "#444";
        msg.style.marginTop = "20px";
        document.querySelector(".product-sections, .container")?.appendChild(msg);
      }
    } else if (msg) {
      msg.remove();
    }
  }

  searchBtn.addEventListener("click", performSearch);
  searchInput.addEventListener("keyup", e => {
    if (e.key === "Enter") performSearch();
    if (searchInput.value === "") performSearch();
  });
}



// ===== Continuous Auto Slide for Top Collections (Final Version) =====
const slider = document.getElementById("collectionsSlider");

if (slider) {
  // Duplicate content for smooth looping
  const clone = slider.innerHTML;
  slider.innerHTML += clone;

  let scrollSpeed = 1; // Adjust speed (0.3 = slower, 1 = faster)

  function scrollCollections() {
    slider.scrollLeft += scrollSpeed;

    // Reset to start when reaching half (because we duplicated content)
    if (slider.scrollLeft >= slider.scrollWidth / 2) {
      slider.scrollLeft = 0;
    }

    requestAnimationFrame(scrollCollections);
  }

  // Start animation
  scrollCollections();

  // Optional: pause on hover
  slider.addEventListener("mouseenter", () => (scrollSpeed = 0));
  slider.addEventListener("mouseleave", () => (scrollSpeed = 0.5));
}




// ===== Auto Slide Between Product Images =====
document.querySelectorAll(".product-card").forEach(card => {
  const imgs = card.querySelectorAll("img");
  let current = 0;
  setInterval(() => {
    imgs[current].style.opacity = 0;
    current = (current + 1) % imgs.length;
    imgs[current].style.opacity = 1;
  }, 2000);
});




// ===== Scroll Fade-In Animation for Sections =====
const fadeElements = document.querySelectorAll('.section-block, .section-title');

function handleScrollFade() {
  const triggerBottom = window.innerHeight * 0.9;
  fadeElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < triggerBottom) {
      el.classList.add('visible');
    } else {
      el.classList.remove('visible');
    }
  });
}

window.addEventListener('scroll', handleScrollFade);
window.addEventListener('load', handleScrollFade);







