// ==========================================================
// Layout
// ==========================================================

import { app } from "./core.js";

export function getHeaderHTML() {

  const totals =
    app && typeof app.getCartTotals === "function"
      ? app.getCartTotals()
      : { count: 0 };

  return `

<nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">

<div class="container">

<a
href="#/"
class="navbar-brand fw-bold d-flex align-items-center gap-2">

<i class="bi bi-gear-fill text-warning"></i>

JK ENTERPRISES

</a>

<button
class="navbar-toggler"
type="button"
data-bs-toggle="collapse"
data-bs-target="#navbarMain">

<span class="navbar-toggler-icon"></span>

</button>

<div
class="collapse navbar-collapse"
id="navbarMain">

<ul class="navbar-nav me-lg-4">

<li class="nav-item">
<a class="nav-link" href="#/">
Home
</a>
</li>

<li class="nav-item">
<a class="nav-link" href="#/products">
Products
</a>
</li>

<li class="nav-item">
<a class="nav-link" href="#/brands">
Brands
</a>
</li>

<li class="nav-item">
<a class="nav-link" href="#/blogs">
Blogs
</a>
</li>

<li class="nav-item">
<a class="nav-link" href="#/contact">
Contact
</a>
</li>

</ul>

<form
id="navbar-search-form"
class="d-flex flex-grow-1 mx-lg-4 my-3 my-lg-0">

<div class="input-group">

<input
id="navbar-search"
type="search"
class="form-control"
placeholder="Search products..."
autocomplete="off">

<button
class="btn btn-warning"
type="submit">

<i class="bi bi-search"></i>

</button>

</div>

</form>

<div class="d-flex">

<a
href="#/checkout"
class="btn btn-warning fw-semibold position-relative">

<i class="bi bi-cart3 me-1"></i>

Cart

<span
id="cart-badge-count"
class="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle ${totals.count ? "" : "d-none"}">

${totals.count}

</span>

</a>

</div>

</div>

</div>

</nav>

`;

}

export function initHeaderEvents() {

const form = document.getElementById("navbar-search-form");

if (!form) return;

form.addEventListener("submit", e => {

e.preventDefault();

const q =
document
.getElementById("navbar-search")
.value
.trim();

if (!q) return;

location.hash =
"#/search?q=" +
encodeURIComponent(q);

});

}

export function getFooterHTML() {

return `

<footer class="bg-dark text-light mt-5">

<div class="container py-5">

<div class="row g-4">

<div class="col-md-4">

<h5 class="fw-bold">

JK Enterprises

</h5>

<p class="text-secondary mb-0">

Wholesale supplier of industrial tools,
power tools, hand tools,
solar products and automotive care products across India.

</p>

</div>

<div class="col-6 col-md-2">

<h6 class="fw-bold">

Company

</h6>

<ul class="list-unstyled">

<li><a class="text-secondary text-decoration-none" href="#/">Home</a></li>

<li><a class="text-secondary text-decoration-none" href="#/about">About</a></li>

<li><a class="text-secondary text-decoration-none" href="#/contact">Contact</a></li>

<li><a class="text-secondary text-decoration-none" href="#/blogs">Blogs</a></li>

</ul>

</div>

<div class="col-6 col-md-3">

<h6 class="fw-bold">

Customer Service

</h6>

<ul class="list-unstyled">

<li><a class="text-secondary text-decoration-none" href="#/shipping">Shipping</a></li>

<li><a class="text-secondary text-decoration-none" href="#/returns">Returns</a></li>

<li><a class="text-secondary text-decoration-none" href="#/faq">FAQ</a></li>

<li><a class="text-secondary text-decoration-none" href="#/privacy">Privacy Policy</a></li>

</ul>

</div>

<div class="col-md-3">

<h6 class="fw-bold">

Need Help?

</h6>

<p class="mb-1">

📞 +91 90506 23210

</p>

<p class="mb-1">

✉️ care@haryana.tools

</p>

</div>

</div>

<hr>

<div class="d-flex flex-column flex-md-row justify-content-between small text-secondary">

<div>

© ${new Date().getFullYear()} JK Enterprises. All Rights Reserved.

</div>

<div>

Made in India 🇮🇳

</div>

</div>

</div>

</footer>

`;

}

export function updateCartBadges() {

const badge =
document.getElementById(
"cart-badge-count"
);

if (!badge) return;

const totals =
app && typeof app.getCartTotals === "function"
? app.getCartTotals()
: { count: 0 };

badge.textContent = totals.count;

badge.classList.toggle(
"d-none",
totals.count === 0
);

}