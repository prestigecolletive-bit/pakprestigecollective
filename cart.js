function renderCart() {
  const mount = document.getElementById("cart-area");
  if (!mount) return;
  const cart = loadCart();

  if (!cart.length) {
    mount.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  let html = "<ul>";
  cart.forEach(item => {
    html += `<li>${item.name} x${item.qty} — Rs. ${(item.price * item.qty).toLocaleString()}</li>`;
  });
  html += `</ul><p><strong>Total: Rs. ${cart.reduce((s,i)=>s+i.price*i.qty,0).toLocaleString()}</strong></p>`;
  mount.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  renderCart();
});