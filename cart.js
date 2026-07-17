// ==========================================================
// Cart Module
// ==========================================================

import { app, api, formatINR } from "./core.js";

export async function render(container) {

    drawCart();

    // ======================================================
    // Draw Cart
    // ======================================================

    async function drawCart() {

        const cart = app.getCart();

        const totals = app.getCartTotals();

        if (!cart.length) {

            container.innerHTML = `

<div class="text-center py-5">

    <i class="bi bi-cart-x display-3 text-muted"></i>

    <h2 class="mt-3">

        Your Cart is Empty

    </h2>

    <p class="text-muted">

        Looks like you haven't added any products yet.

    </p>

    <a
        href="products.html"
        class="btn btn-warning mb-5">

        Continue Shopping

    </a>

    <hr class="my-5">

    <div class="d-flex justify-content-between align-items-center mb-4">

        <h3 class="fw-bold mb-0">

            Popular Products

        </h3>

    </div>

    <div
        id="suggested-products"
        class="row g-4">

        <div class="col-12 text-center py-5">

            <div class="spinner-border text-warning"></div>

        </div>

    </div>

</div>

`;

            try {

                const products =
                    (await api.get("products"))
                    .slice(0, 4);

                renderSuggestions(products);

            }

            catch (err) {

                console.error(err);

                document.getElementById(
                    "suggested-products"
                ).innerHTML = `

<div class="col-12">

    <div class="alert alert-warning text-center">

        Unable to load products.

    </div>

</div>

`;

            }

            return;

        }

        // ==================================================
        // Cart Page
        // ==================================================

        container.innerHTML = `

<h2 class="fw-bold mb-4">

    Shopping Cart

</h2>

<div class="row g-4">

    <div class="col-lg-8">

        <div class="card shadow-sm">

            <div class="table-responsive">

                <table class="table align-middle mb-0">

                    <thead class="table-light">

                        <tr>

                            <th>

                                Product

                            </th>

                            <th
                                class="text-center"
                                style="width:140px;">

                                Quantity

                            </th>

                            <th
                                class="text-end">

                                Total

                            </th>

                            <th
                                class="text-center"
                                style="width:60px;">

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        ${cart.map(item => {

                            return renderCartRow(item);

                        }).join("")}

                    </tbody>

                </table>

            </div>

        </div>

    </div>

    <div class="col-lg-4">

        <div class="card shadow-sm">

            <div class="card-body">

                <h5 class="fw-bold mb-4">

                    Order Summary

                </h5>

                <div class="d-flex justify-content-between mb-2">

                    <span>

                        Subtotal

                    </span>

                    <strong>

                        ${formatINR(totals.subtotal)}

                    </strong>

                </div>

                <div class="d-flex justify-content-between mb-3">

                    <span>

                        Shipping

                    </span>

                    <span class="text-success">

                        Free

                    </span>

                </div>

                <hr>

                <div class="d-flex justify-content-between mb-4">

                    <h5 class="mb-0">

                        Total

                    </h5>

                    <h4 class="text-danger mb-0">

                        ${formatINR(totals.total)}

                    </h4>

                </div>

                <a
                    href="checkout.html"
                    class="btn btn-warning w-100">

                    Proceed to Checkout

                </a>

            </div>

        </div>

    </div>

</div>

`;

        bindCartEvents();

    }

// ======================================================
// Suggested Products
// ======================================================

function renderSuggestions(products) {

    const grid =
        document.getElementById(
            "suggested-products"
        );

    if (!grid) return;

    if (!products.length) {

        grid.innerHTML = `

<div class="col-12">

    <div class="alert alert-light text-center">

        No products available.

    </div>

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

        const image =
            product.Image1 ||
            product.Image ||
            "assets/404.webp";

        const price = Number(

            String(

                product["Sale Price"] ||
                product.Price ||
                0

            ).replace(/[^\d.]/g, "")

        ) || 0;

        return `

<div class="col-6 col-md-3">

    <div class="card h-100 shadow-sm">

        <a
            href="product.html?id=${encodeURIComponent(sku)}">

            <img
                src="${image}"
                class="card-img-top p-3"
                style="height:180px;object-fit:contain;"
                alt="${name}">

        </a>

        <div class="card-body d-flex flex-column">

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

            <div class="fw-bold text-danger mb-3">

                ${formatINR(price)}

            </div>

            <div class="input-group input-group-sm mb-3">

                <button
                    class="btn btn-outline-secondary qty-minus"
                    data-sku="${sku}">

                    −

                </button>

                <input
                    id="qty-${sku}"
                    class="form-control text-center"
                    value="1"
                    readonly>

                <button
                    class="btn btn-outline-secondary qty-plus"
                    data-sku="${sku}">

                    +

                </button>

            </div>

            <button
                class="btn btn-warning add-cart mb-2"
                data-sku="${sku}"
                data-name="${name.replace(/"/g,"&quot;")}"
                data-price="${price}"
                data-img="${image}">

                Add to Cart

            </button>

            <a
                href="product.html?id=${encodeURIComponent(sku)}"
                class="btn btn-outline-dark">

                View Details

            </a>

        </div>

    </div>

</div>

`;

    }).join("");

    bindSuggestionEvents();

}
// ======================================================
// Suggested Product Events
// ======================================================

function bindSuggestionEvents() {

    // ==============================================
    // Quantity +
    // ==============================================

    document.querySelectorAll(".qty-plus").forEach(button => {

        button.addEventListener("click", () => {

            const input = document.getElementById(
                "qty-" + button.dataset.sku
            );

            input.value =
                Number(input.value) + 1;

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

            const quantity =
                Number(input.value);

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

            const originalText =
                button.innerHTML;

            button.classList.replace(
                "btn-warning",
                "btn-success"
            );

            button.innerHTML =
                '<i class="bi bi-check-lg me-1"></i>Added';

            setTimeout(() => {

                button.classList.replace(
                    "btn-success",
                    "btn-warning"
                );

                button.innerHTML =
                    originalText;

            }, 1500);

        });

    });

}
// ======================================================
// Cart Row
// ======================================================

function renderCartRow(item) {

    return `

<tr>

    <td>

        <div class="d-flex align-items-center gap-3">

            <img
                src="${item.img || "assets/404.webp"}"
                class="border rounded p-1 bg-light"
                style="width:60px;height:60px;object-fit:contain;"
                alt="${item.name}">

            <div>

                <a
                    href="product.html?id=${encodeURIComponent(item.sku)}"
                    class="fw-semibold text-dark text-decoration-none">

                    ${item.name}

                </a>

                <div class="small text-muted">

                    SKU: ${item.sku}

                </div>

            </div>

        </div>

    </td>

    <td>

        <div class="input-group input-group-sm">

            <button
                class="btn btn-outline-secondary dec-btn"
                data-id="${item.sku}"
                data-q="${item.qty}">

                <i class="bi bi-dash"></i>

            </button>

            <input
                class="form-control text-center"
                value="${item.qty}"
                readonly>

            <button
                class="btn btn-outline-secondary inc-btn"
                data-id="${item.sku}"
                data-q="${item.qty}">

                <i class="bi bi-plus"></i>

            </button>

        </div>

    </td>

    <td class="text-end fw-bold">

        ${formatINR(item.price * item.qty)}

    </td>

    <td class="text-center">

        <button
            class="btn btn-link text-danger del-btn"
            data-id="${item.sku}">

            <i class="bi bi-trash3"></i>

        </button>

    </td>

</tr>

`;

}

// ======================================================
// Cart Events
// ======================================================

function bindCartEvents() {

    document.querySelectorAll(".dec-btn").forEach(button => {

        button.addEventListener("click", () => {

            const id = button.dataset.id;

            const quantity =
                Number(button.dataset.q);

            app.updateCart(
                id,
                quantity - 1
            );

            render(document.getElementById("main-content"));

        });

    });

    document.querySelectorAll(".inc-btn").forEach(button => {

        button.addEventListener("click", () => {

            const id = button.dataset.id;

            const quantity =
                Number(button.dataset.q);

            const cart = app.getCart();

            const item =
                cart.find(
                    product => product.sku === id
                );

            if (!item) return;

            app.updateCart(
                id,
                quantity + 1,
                item.price,
                item.name,
                item.img
            );

            render(document.getElementById("main-content"));

        });

    });

    document.querySelectorAll(".del-btn").forEach(button => {

        button.addEventListener("click", () => {

            app.updateCart(
                button.dataset.id,
                0
            );

            render(document.getElementById("main-content"));

        });

    });

}}