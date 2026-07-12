// ==========================================================
// Global Dynamic Layout Architecture
// ==========================================================
import { app } from "./core.js";

export function getHeaderHTML() {
  const totals = app.getCartTotals();
  return `
    <nav class="navbar navbar-expand-md navbar-dark bg-dark sticky-top py-2">
      <div class="container">
        <a class="navbar-brand fw-bold text-warning" href="#/index">JK ENTERPRISES</a>
        <form class="d-flex flex-grow-1 mx-2 mx-md-4" onsubmit="event.preventDefault(); location.hash='#/search?q='+this.q.value;">
          <input class="form-control form-control-sm rounded-0 border-0" type="search" name="q" placeholder="Search brands, products, tools..." required>
          <button class="btn btn-warning btn-sm rounded-0" type="submit"><i class="bi bi-search"></i></button>
        </form>
        <div class="d-flex align-items-center">
          <a href="#/cart" class="btn btn-outline-warning btn-sm position-relative ms-2">
            <i class="bi bi-cart3 fs-5"></i>
            <span id="global-cart-badge" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">${totals.count}</span>
          </a>
          <button class="navbar-toggler btn-sm ms-2 border-0" type="button" data-bs-toggle="collapse" data-bs-target="#nav-menu"><span class="navbar-toggler-icon"></span></button>
        </div>
        <div class="collapse navbar-collapse flex-grow-0" id="nav-menu">
          <div class="navbar-nav ms-auto pt-2 pt-md-0 small">
            <a class="nav-link text-white" href="#/products">All Products</a>
            <a class="nav-link text-white" href="#/brands">Brands</a>
            <a class="nav-link text-white" href="#/blogs">Buying Guides</a>
            <a class="nav-link text-white" href="#/contact">Contact</a>
          </div>
        </div>
      </div>
    </nav>
  `;
}

export function getFooterHTML() {
  return `
    <footer class="bg-dark text-secondary pt-4 pb-2 mt-5 border-top border-secondary small">
      <div class="container">
        <div class="row g-3">
          <div class="col-6 col-md-3">
            <h6 class="text-white fw-bold">Company</h6>
            <ul class="list-unstyled mb-0"><li class="my-1"><a href="#/about" class="text-secondary text-decoration-none">About Us</a></li><li class="my-1"><a href="#/contact" class="text-secondary text-decoration-none">Contact Support</a></li></ul>
          </div>
          <div class="col-6 col-md-3">
            <h6 class="text-white fw-bold">Policy</h6>
            <ul class="list-unstyled mb-0"><li class="my-1"><a href="#/privacy" class="text-secondary text-decoration-none">Privacy</a></li><li class="my-1"><a href="#/terms" class="text-secondary text-decoration-none">Terms</a></li></ul>
          </div>
          <div class="col-6 col-md-3">
            <h6 class="text-white fw-bold">Logistics</h6>
            <ul class="list-unstyled mb-0"><li class="my-1"><a href="#/shipping" class="text-secondary text-decoration-none">Shipping</a></li><li class="my-1"><a href="#/returns" class="text-secondary text-decoration-none">Returns</a></li></ul>
          </div>
          <div class="col-6 col-md-3 text-md-end">
            <h6 class="text-white fw-bold">JK Enterprises</h6>
            <p class="mb-0 text-muted">India's Industrial Hub.<br>Ph: +91 9050623210</p>
          </div>
        </div>
        <hr class="border-secondary my-3">
        <p class="text-center text-muted mb-0 font-monospace" style="font-size:11px;">&copy; 2026 JK Enterprises. Wholesale Supplier. All Rights Reserved.</p>
      </div>
    </footer>
  `;
}

export function updateCartBadges() {
  const totals = app.getCartTotals();
  const badge = document.getElementById("global-cart-badge");
  if(badge) badge.innerText = totals.count;
}
document.addEventListener("cartUpdated", updateCartBadges);