// ==========================================================
// Layout
// ==========================================================

import { app } from "./core.js";

// ==========================================================
// Header
// ==========================================================

export function getHeaderHTML() {

    const totals =

        app?.getCartTotals?.() ||

        { count: 0 };

    return `

<nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">

    <div class="container">

        <a
            href="index.html"
            class="navbar-brand fw-bold d-flex align-items-center gap-2">

            <i class="bi bi-gear-fill text-warning"></i>

            HARYANA TOOLS

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

                    <a
                        class="nav-link"
                        href="products.html">

                        Products

                    </a>

                </li>

                <li class="nav-item">

                    <a
                        class="nav-link"
                        href="brands.html">

                        Brands

                    </a>

                </li>

                <li class="nav-item">

                    <a
                        class="nav-link"
                        href="blogs.html">

                        Blogs

                    </a>

                </li>

                <li class="nav-item">

                    <a
                        class="nav-link"
                        href="contact.html">

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
                        placeholder="Search..."
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
                    href="cart.html"
                    class="btn btn-warning position-relative">

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

// ==========================================================
// Header Events
// ==========================================================

export function initHeaderEvents() {

    const form =
        document.getElementById(
            "navbar-search-form"
        );

    if (!form) return;

    form.addEventListener("submit", event => {

        event.preventDefault();

        const query =

            document
                .getElementById("navbar-search")
                .value
                .trim();

        if (!query) return;

        window.location.href =

            "search.html?q=" +

            encodeURIComponent(query);

    });

}
// ==========================================================
// Footer
// ==========================================================

export function getFooterHTML() {

    return `

<footer class="bg-dark text-light mt-5">

    <div class="container py-5">

        <div class="row g-4">

            <div class="col-lg-4">

                <h5 class="fw-bold mb-3">

                    HARYANA TOOLS

                </h5>

                <p class="text-secondary mb-3">

                    Wholesale supplier of industrial tools,
                    power tools, hand tools, solar products,
                    welding machines and workshop equipment
                    across India.

                </p>

                <div class="d-flex gap-3 fs-5">

                    <a
                        href="https://wa.me/919050623210"
                        class="text-success"
                        target="_blank"
                        rel="noopener">

                        <i class="bi bi-whatsapp"></i>

                    </a>

                    <a
                        href="mailto:care@haryana.tools"
                        class="text-light">

                        <i class="bi bi-envelope-fill"></i>

                    </a>

                    <a
                        href="tel:+919050623210"
                        class="text-warning">

                        <i class="bi bi-telephone-fill"></i>

                    </a>

                </div>

            </div>

            <div class="col-6 col-lg-2">

                <h6 class="fw-bold mb-3">

                    Company

                </h6>

                <ul class="list-unstyled small">

                    <li><a class="text-secondary text-decoration-none" href="index.html">Home</a></li>

                    <li><a class="text-secondary text-decoration-none" href="about.html">About</a></li>

                    <li><a class="text-secondary text-decoration-none" href="brands.html">Brands</a></li>

                    <li><a class="text-secondary text-decoration-none" href="blogs.html">Blogs</a></li>

                    <li><a class="text-secondary text-decoration-none" href="contact.html">Contact</a></li>

                </ul>

            </div>

            <div class="col-6 col-lg-3">

                <h6 class="fw-bold mb-3">

                    Support

                </h6>

                <ul class="list-unstyled small">

                    <li><a class="text-secondary text-decoration-none" href="shipping.html">Shipping</a></li>

                    <li><a class="text-secondary text-decoration-none" href="returns.html">Returns</a></li>

                    <li><a class="text-secondary text-decoration-none" href="faq.html">FAQ</a></li>

                    <li><a class="text-secondary text-decoration-none" href="privacy.html">Privacy Policy</a></li>

                    <li><a class="text-secondary text-decoration-none" href="terms.html">Terms & Conditions</a></li>

                </ul>

            </div>

            <div class="col-lg-3">

                <h6 class="fw-bold mb-3">

                    Contact

                </h6>

                <p class="mb-2">

                    <i class="bi bi-telephone me-2"></i>

                    +91 90506 23210

                </p>

                <p class="mb-2">

                    <i class="bi bi-envelope me-2"></i>

                    care@haryana.tools

                </p>

                <p class="mb-0 text-secondary">

                    Serving customers across India.

                </p>

            </div>

        </div>

        <hr class="my-4">

        <div class="d-flex flex-column flex-md-row justify-content-between align-items-center small text-secondary">

            <div>

                © ${new Date().getFullYear()} HARYANA TOOLS.
                All Rights Reserved.

            </div>

            <div>

                Made in India 🇮🇳

            </div>

        </div>

    </div>

</footer>

`;

}
// ==========================================================
// Cart Badge
// ==========================================================

export function updateCartBadges() {

    const badge =
        document.getElementById(
            "cart-badge-count"
        );

    if (!badge) return;

    const { count = 0 } =

        app?.getCartTotals?.() ||

        {};

    badge.textContent = count;

    badge.classList.toggle(

        "d-none",

        count === 0

    );

}