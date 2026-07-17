// ==========================================================
// Home
// ==========================================================

import {
    api,
    app,
    formatINR
} from "./core.js";

export async function render(container) {

    container.innerHTML = `

<!-- Hero Categories -->

<div class="row g-3 mb-5">

    <div class="col-6 col-lg-3">

        <a
            href="brand.html?name=Eastman"
            class="card shadow-sm text-decoration-none h-100">

            <div class="card-body d-flex align-items-center gap-3 p-2">

                <img
                    src="assets/eastman.webp"
                    alt="Eastman"
                    style="height:38px;width:90px;object-fit:contain;">

                <div>

                    <div class="fw-semibold text-dark">

                        Eastman

                    </div>

                    <small class="text-muted">

                        Power Tools

                    </small>

                </div>

            </div>

        </a>

    </div>

    <div class="col-6 col-lg-3">

        <a
            href="brand.html?name=Foxcare"
            class="card shadow-sm text-decoration-none h-100">

            <div class="card-body d-flex align-items-center gap-3 p-2">

                <img
                    src="assets/foxcare.webp"
                    alt="Foxcare"
                    style="height:38px;width:90px;object-fit:contain;">

                <div>

                    <div class="fw-semibold text-dark">

                        Foxcare

                    </div>

                    <small class="text-muted">

                        Car Care

                    </small>

                </div>

            </div>

        </a>

    </div>

    <div class="col-6 col-lg-3">

        <a
            href="products.html?category=Solar"
            class="card shadow-sm text-decoration-none h-100">

            <div class="card-body d-flex align-items-center gap-3 p-2">

                <img
                    src="assets/loom.webp"
                    alt="Solar"
                    style="height:38px;width:90px;object-fit:contain;">

                <div>

                    <div class="fw-semibold text-dark">

                        Solar

                    </div>

                    <small class="text-muted">

                        Panels

                    </small>

                </div>

            </div>

        </a>

    </div>

    <div class="col-6 col-lg-3">

        <a
            href="products.html"
            class="card shadow-sm text-decoration-none h-100">

            <div class="card-body d-flex align-items-center gap-3 p-2">

                <img
                    src="assets/404.webp"
                    alt="Products"
                    style="height:38px;width:90px;object-fit:contain;">

                <div>

                    <div class="fw-semibold text-dark">

                        All Products

                    </div>

                    <small class="text-muted">

                        Browse

                    </small>

                </div>

            </div>

        </a>

    </div>

</div>

<!-- Featured Products -->

<div class="d-flex justify-content-between align-items-center mb-4">

    <h2 class="fw-bold mb-0">

        Featured Products

    </h2>

    <a
        href="products.html"
        class="btn btn-outline-dark">

        View All

    </a>

</div>

<div
    id="home-products-feed"
    class="row g-4">

    <div class="col-12 text-center py-5">

        <div class="spinner-border text-warning"></div>

        <p class="text-muted mt-3 mb-0">

            Loading products...

        </p>

    </div>

</div>

`;

    try {

        const products =
            await api.get("products");

        const featured = [...products]

            .filter(

                product =>

                    Number(
                        product["Stock Quantity"] || 0
                    ) > 0

            )

            .sort(() => Math.random() - 0.5)

            .slice(0, 12);

        renderProducts(featured);

    }

    catch (error) {

        console.error(error);

        const grid =
            document.getElementById(
                "home-products-feed"
            );

        if (!grid) return;

        grid.innerHTML = `

<div class="col-12">

    <div class="alert alert-warning text-center">

        Unable to load products.

    </div>

</div>

`;

    }

}
// ==========================================================
// Featured Products
// ==========================================================

function renderProducts(products) {

    const grid =
        document.getElementById(
            "home-products-feed"
        );

    if (!grid) return;

    if (!products.length) {

        grid.innerHTML = `

<div class="col-12 text-center py-5 text-muted">

    No products available.

</div>

`;

        return;

    }

    grid.innerHTML = products.map(product => {

        const sku = String(

            product.ProductID ||
            product["Product ID"] ||
            product.SKU ||
            product.ID ||
            ""

        ).trim();

        const name =
            product["Item Name"] ||
            product.Name ||
            "Product";

        const brand =
            product.Brand || "";

        const price = Number(

            String(

                product["Sale Price"] ||
                product.Price ||
                0

            ).replace(/[^\d.]/g, "")

        ) || 0;

        const image =
            product.Image1 ||
            product.Image ||
            "assets/404.webp";

        return `

<div class="col-6 col-md-4 col-lg-3">

    <div class="card h-100 shadow-sm border-0">

        <a
            href="product.html?id=${encodeURIComponent(sku)}"
            class="text-decoration-none">

            <img
                src="${image}"
                class="card-img-top p-3"
                style="height:220px;object-fit:contain;background:#fafafa;"
                alt="${name}">

        </a>

        <div class="card-body d-flex flex-column">

            ${brand ? `

            <small class="text-muted text-uppercase fw-semibold mb-1">

                ${brand}

            </small>

            ` : ""}

            <h6
                class="fw-semibold mb-2"
                style="
                    display:-webkit-box;
                    -webkit-line-clamp:2;
                    -webkit-box-orient:vertical;
                    overflow:hidden;
                    min-height:48px;">

                ${name}

            </h6>

            <div class="fw-bold text-danger fs-5 mb-3">

                ${formatINR(price)}

            </div>

            <div class="mt-auto">

                <label class="small text-muted">

                    Quantity

                </label>

                <div class="input-group input-group-sm mb-3">

                    <button
                        class="btn btn-outline-secondary qty-minus"
                        data-sku="${sku}">

                        <i class="bi bi-dash"></i>

                    </button>

                    <input
                        id="qty-${sku}"
                        class="form-control text-center"
                        value="1"
                        readonly>

                    <button
                        class="btn btn-outline-secondary qty-plus"
                        data-sku="${sku}">

                        <i class="bi bi-plus"></i>

                    </button>

                </div>

                <button
                    class="btn btn-warning w-100 add-cart mb-2"
                    data-sku="${sku}"
                    data-name="${name.replace(/"/g, "&quot;")}"
                    data-price="${price}"
                    data-img="${image}">

                    Add to Cart

                </button>

                <a
                    href="product.html?id=${encodeURIComponent(sku)}"
                    class="btn btn-outline-secondary w-100">

                    View Details

                </a>

            </div>

        </div>

    </div>

</div>

`;

    }).join("");

    bindProductEvents();

}
// ==========================================================
// Product Card Events
// ==========================================================

function bindProductEvents() {

    // ==============================================
    // Quantity +
    // ==============================================

    document.querySelectorAll(".qty-plus").forEach(button => {

        button.addEventListener("click", () => {

            const input = document.getElementById(

                "qty-" + button.dataset.sku

            );

            if (!input) return;

            input.value = Number(input.value) + 1;

        });

    });

    // ==============================================
    // Quantity -
    // ==============================================

    document.querySelectorAll(".qty-minus").forEach(button => {

        button.addEventListener("click", () => {

            const input = document.getElementById(

                "qty-" + button.dataset.sku

            );

            if (!input) return;

            const quantity = Number(input.value);

            if (quantity > 1) {

                input.value = quantity - 1;

            }

        });

    });

    // ==============================================
    // Add to Cart
    // ==============================================

    document.querySelectorAll(".add-cart").forEach(button => {

        button.addEventListener("click", () => {

            const quantity = Number(

                document.getElementById(

                    "qty-" + button.dataset.sku

                ).value

            );

            app.updateCart(

                button.dataset.sku,

                quantity,

                Number(button.dataset.price),

                button.dataset.name,

                button.dataset.img

            );

            const original = button.innerHTML;

            button.classList.replace(

                "btn-warning",

                "btn-success"

            );

            button.innerHTML = `

<i class="bi bi-check-lg me-1"></i>

Added

`;

            setTimeout(() => {

                button.classList.replace(

                    "btn-success",

                    "btn-warning"

                );

                button.innerHTML = original;

            }, 1500);

        });

    });

}