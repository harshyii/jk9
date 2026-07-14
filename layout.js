// ==========================================================
// CORE LAYOUT & NAVIGATION INTERFACE MODULE
// ==========================================================
import { app, formatINR } from "./core.js";

export function getHeaderHTML() {
  // Defensive fallbacks to prevent runtime crashes if the core module isn't ready
  const totals = (app && typeof app.getCartTotals === 'function') 
    ? app.getCartTotals() 
    : { count: 0, subtotal: 0 };

  return `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm py-2">
      <div class="container">
        <a class="navbar-brand fw-bold font-monospace d-flex align-items-center gap-2" href="#/">
          <i class="bi bi-gear-fill text-warning spinning-logo"></i> JK ENTERPRISES
        </a>
        <button class="navbar-toggler rounded-0 border-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#navMatrix">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navMatrix">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0 font-monospace small">
            <li class="nav-item"><a class="nav-link" href="#/">Home Matrix</a></li>
            <li class="nav-item"><a class="nav-link" href="#/products">Product Catalog</a></li>
          </ul>
          <div class="d-flex align-items-center gap-3">
            <a href="#/checkout" class="btn btn-warning btn-sm rounded-0 fw-bold font-monospace position-relative d-flex align-items-center gap-2">
              <i class="bi bi-cart3"></i> View Cart
              <span id="cart-badge-count" class="badge bg-danger rounded-pill ${totals.count === 0 ? 'd-none' : ''}">${totals.count}</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  `;
}

export function getFooterHTML() {
  return `
    <footer class="bg-dark text-muted py-4 mt-5 border-top border-secondary small">
      <div class="container text-center font-monospace">
        <p class="mb-1 text-light fw-bold">JK Enterprises &copy; ${new Date().getFullYear()}</p>
        <p class="mb-0" style="font-size: 11px;">Industrial Supply Chain Distribution Hub Matrix • Sec-9 Architecture Vector</p>
      </div>
    </footer>
  `;
}

export function updateCartBadges() {
  const countBadge = document.getElementById("cart-badge-count");
  if (!countBadge) return; // Guard clause in case navbar isn't rendered yet

  const totals = (app && typeof app.getCartTotals === 'function') 
    ? app.getCartTotals() 
    : { count: 0, subtotal: 0 };

  if (totals.count > 0) {
    countBadge.textContent = totals.count;
    countBadge.classList.remove("d-none");
  } else {
    countBadge.classList.add("d-none");
  }
}