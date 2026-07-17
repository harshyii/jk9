// ==========================================================
// Products
// ==========================================================

import { api, app, formatINR } from "./core.js";

// ==========================================================
// Helpers
// ==========================================================

const sku = product =>

    String(

        product.ProductID ||
        product["Product ID"] ||
        product.SKU ||
        product.ID ||
        product.Model ||
        product.ASIN ||
        ""

    ).trim();

const name = product =>

    product["Item Name"] ||

    product.Name ||

    "Unnamed Product";

const brand = product =>

    product.Brand || "";

const image = product =>

    product.Image1 ||

    product.Image ||

    "assets/404.webp";

const price = product =>

    Number(

        String(

            product["Sale Price"] ||

            product.Price ||

            0

        ).replace(/[^\d.]/g, "")

    ) || 0;

// ==========================================================
// Catalog
// ==========================================================

export async function render(container, params = {}) {

    if (params.id) {

        return renderDetail(

            container,

            params.id

        );

    }

    container.innerHTML = `

<div class="row">

    <div class="col-lg-3 mb-4">

        <div class="card shadow-sm">

            <div class="card-body">

                <h5 class="mb-3">

                    Products

                </h5>

                <label
                    class="form-label">

                    Sort By

                </label>

                <select
                    id="sort"
                    class="form-select">

                    <option value="">

                        Default

                    </option>

                    <option value="low">

                        Price : Low to High

                    </option>

                    <option value="high">

                        Price : High to Low

                    </option>

                </select>

            </div>

        </div>

    </div>

    <div class="col-lg-9">

        <div class="d-flex justify-content-between align-items-center mb-3">

            <h3 class="m-0">

                ${params.brand
                    ? `${params.brand} Products`
                    : "All Products"}

            </h3>

        </div>

        <div
            id="catalog-grid"
            class="row g-4">

            <div class="col-12 text-center py-5">

                <div class="spinner-border text-warning"></div>

                <p class="mt-3 mb-0 text-muted">

                    Loading products...

                </p>

            </div>

        </div>

    </div>

</div>

`;

    try {

        const response =

            await api.get("products");

        const products =

            Array.isArray(response)

                ? response

                : response.data || [];

        let filtered = [...products];

        if (params.brand) {

            filtered = filtered.filter(product =>

                brand(product)

                    .trim()

                    .toLowerCase() ===

                params.brand

                    .trim()

                    .toLowerCase()

            );

        }

        const grid =

            document.getElementById(

                "catalog-grid"

            );

        renderGrid(

            grid,

            filtered

        );

        document
            .getElementById("sort")
            .addEventListener("change", event => {

                const list = [...filtered];

                switch (event.target.value) {

                    case "low":

                        list.sort(

                            (a, b) =>

                                price(a) -

                                price(b)

                        );

                        break;

                    case "high":

                        list.sort(

                            (a, b) =>

                                price(b) -

                                price(a)

                        );

                        break;

                }

                renderGrid(

                    grid,

                    list

                );

            });

    }

    catch (error) {

        console.error(error);

        document.getElementById(

            "catalog-grid"

        ).innerHTML = `

<div class="col-12">

    <div class="alert alert-danger">

        Unable to load products.

    </div>

</div>

`;

    }

}
// ==========================================================
// Product Grid
// ==========================================================
function brandColor(brand) {

    const colors = {
        eastman: "#0d6efd",
        bosch: "#005691",
        makita: "#009688",
        dewalt: "#facc15",
        stanley: "#f59e0b",
        ingco: "#f97316",
        total: "#16a34a",
        hikoki: "#22c55e",
        hitachi: "#22c55e",
        taparia: "#dc2626",
        xtra: "#7c3aed"
    };

    return colors[(brand || "").toLowerCase()] || "#343a40";

}


function renderGrid(target, products) {

    if (!target) {

        console.error("catalog-grid not found");

        return;

    }

    if (!products.length) {

        target.innerHTML = `

<div class="col-12 text-center py-5 text-muted">

    No products available.

</div>

`;

        return;

    }

    target.innerHTML = products.map(product => `

<div class="col-6 col-md-4 col-lg-3">

    <div class="card h-100 shadow-sm border-0 rounded-3">

        <a
    href="product.html?id=${encodeURIComponent(sku(product))}">

    <div class="position-relative">

        <img
            src="${image(product)}"
            class="card-img-top p-3"
            style="height:220px;object-fit:contain;background:#fafafa"
            alt="${name(product)}">

        ${brand(product) ? `

        <span
    class="position-absolute top-1.5 end-0 mt-2 me-2 px-3 py-1 rounded-2 text-white fw-semibold shadow-sm"
    style="
        background:${brandColor(brand(product))};
        font-size:.72rem;
        letter-spacing:.3px;
        z-index:2;
    ">

    ${brand(product)}

</span>

        ` : ""}

    </div>

</a>

        <div class="card-body d-flex flex-column p-3">

        

            <h6
                class="fw-semibold mb-2"
                style="
                    display:-webkit-box;
                    -webkit-line-clamp:2;
                    -webkit-box-orient:vertical;
                    overflow:hidden;
                    min-height:48px;">

                ${name(product)}

            </h6>

            <div class="fw-bold text-danger fs-4 mb-3">

                ${formatINR(price(product))}

            </div>

            <div class="mt-auto">

                <label class="small text-muted">

                    Quantity

                </label>

                <div class="input-group input-group-sm mb-3">

                    <button
                        class="btn btn-outline-secondary qty-minus"
                        data-sku="${sku(product)}">

                        <i class="bi bi-dash"></i>

                    </button>

                    <input
                        id="qty-${sku(product)}"
                        class="form-control text-center"
                        value="1"
                        readonly>

                    <button
                        class="btn btn-outline-secondary qty-plus"
                        data-sku="${sku(product)}">

                        <i class="bi bi-plus"></i>

                    </button>

                </div>

                <button
                    class="btn btn-warning w-100 add-cart mb-2"
                    data-sku="${sku(product)}"
                    data-name="${name(product).replace(/"/g, "&quot;")}"
                    data-price="${price(product)}"
                    data-img="${image(product)}">

                    <i class="bi bi-cart3 me-1"></i>

                    Add to Cart

                </button>

                <a
                    href="product.html?id=${encodeURIComponent(sku(product))}"
                    class="btn btn-outline-secondary w-100">

                    View Details

                </a>

            </div>

        </div>

    </div>

</div>

`).join("");

    bindGridEvents(target);

}
// ==========================================================
// Product Grid Events
// ==========================================================

function bindGridEvents(target) {

    // ==============================================
    // Quantity +
    // ==============================================

    target.querySelectorAll(".qty-plus").forEach(button => {

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

    target.querySelectorAll(".qty-minus").forEach(button => {

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

    target.querySelectorAll(".add-cart").forEach(button => {

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
// ==========================================================
// Product Detail
// ==========================================================

async function renderDetail(container, id) {

    container.innerHTML = `

<div class="text-center py-5">

    <div class="spinner-border text-warning"></div>

</div>

`;

    try {

    const response =

        await api.get("products");

    const products =

        Array.isArray(response)

            ? response

            : response.data || [];

    const product = products.find(item =>

        sku(item) === String(id).trim()

    );

    if (!product) {

        document.title = "Product Not Found | Haryana Tools";

        container.innerHTML = `

<div class="alert alert-warning">

    <h1 class="h4 mb-3">

        Product Not Found

    </h1>

    <p class="mb-0">

        The requested product could not be found.

    </p>

</div>

`;

        return;

    }

    // ======================================================
    // SEO
    // ======================================================

    document.title = `${name(product)} | Haryana Tools`;

    document
        .querySelector('meta[name="description"]')
        ?.setAttribute(
            "content",
            (product.Description || name(product))
                .substring(0, 155)
        );

    document
    .querySelector('link[rel="canonical"]')
    ?.setAttribute(
        "href",
        `https://haryana.tools/product.html?id=${encodeURIComponent(sku(product))}`
    );

    document
        .querySelector('meta[property="og:title"]')
        ?.setAttribute(
            "content",
            name(product)
        );

    document
        .querySelector('meta[property="og:description"]')
        ?.setAttribute(
            "content",
            product.Description || ""
        );

    document
        .querySelector('meta[property="og:image"]')
        ?.setAttribute(
            "content",
            image(product)
        );

        const salePrice = price(product);

        const mrp = Number(

            String(

                product.MRP ||

                salePrice

            ).replace(/[^\d.]/g, "")

        ) || salePrice;

        const img1 = image(product);

        const img2 =

            product.Image2 ||

            img1;

        container.innerHTML = `

<div class="row g-5">

    ${renderGallery(

        img1,

        img2,

        name(product)

    )}

    ${renderProductInfo(

        product,

        salePrice,

        mrp

    )}

</div>

${renderSpecifications(product)}

`;

        bindGallery();

        bindDetailCart(

            product,

            salePrice,

            img1

        );

    }

    catch (error) {

        console.error(error);

        container.innerHTML = `

<div class="alert alert-danger">

    Unable to load product.

</div>

`;

    }

}
// ==========================================================
// Product Gallery
// ==========================================================

function renderGallery(img1, img2, productName) {

    return `

<div class="col-lg-5">

    <div class="card shadow-sm border-0">

        <img
            id="product-main-image"
            src="${img1}"
            class="img-fluid p-4"
            style="height:420px;object-fit:contain"
            alt="${productName}">

    </div>

    <div class="row g-2 mt-3">

        ${img1 ? `

        <div class="col-6">

            <img
                src="${img1}"
                class="img-fluid border rounded product-thumb"
                style="height:100px;object-fit:contain;cursor:pointer"
                alt="${productName}">

        </div>

        ` : ""}

        ${img2 && img2 !== img1 ? `

        <div class="col-6">

            <img
                src="${img2}"
                class="img-fluid border rounded product-thumb"
                style="height:100px;object-fit:contain;cursor:pointer"
                alt="${productName}">

        </div>

        ` : ""}

    </div>

</div>

`;

}

// ==========================================================
// Gallery Events
// ==========================================================

function bindGallery() {

    const mainImage =

        document.getElementById(

            "product-main-image"

        );

    if (!mainImage) return;

    document.querySelectorAll(

        ".product-thumb"

    ).forEach(image => {

        image.addEventListener(

            "click",

            () => {

                mainImage.src = image.src;

            }

        );

    });

}
// ==========================================================
// Product Information
// ==========================================================

function renderProductInfo(product, salePrice, mrp) {

    const description =

        product.Description || "";

    return `

<div class="col-lg-7">

    <small class="text-uppercase text-muted fw-semibold">

        ${brand(product)}

    </small>

    <h1 class="fw-bold mt-2">

        ${name(product)}

    </h1>

    <p class="text-muted">

        SKU :
        <strong>${sku(product)}</strong>

    </p>

    <div class="d-flex align-items-center gap-3 mb-3">

        <h2 class="text-danger fw-bold mb-0">

            ${formatINR(salePrice)}

        </h2>

        ${mrp > salePrice ? `

        <del class="text-muted">

            ${formatINR(mrp)}

        </del>

        ` : ""}

    </div>

    <div class="mb-4">

        <h5 class="fw-bold mb-3">

            About this item

        </h5>

        ${description
            ? description
                .split(". ")
                .map(line => `

<p class="mb-2">

    ${line.trim()}${line.endsWith(".") ? "" : "."}

</p>

`)
                .join("")
            : `

<p class="text-muted">

    No description available.

</p>

`}

    </div>

    <table class="table table-bordered table-sm">

        <tr>

            <th width="35%">

                Brand

            </th>

            <td>

                ${brand(product)}

            </td>

        </tr>

        <tr>

            <th>

                SKU

            </th>

            <td>

                ${sku(product)}

            </td>

        </tr>

        <tr>

            <th>

                Stock

            </th>

            <td>

                ${product["Stock Quantity"] || "-"}

            </td>

        </tr>

        <tr>

            <th>

                Unit

            </th>

            <td>

                ${product.Unit || "-"}

            </td>

        </tr>

        <tr>

            <th>

                Warranty

            </th>

            <td>

                ${product.Warranty || "-"}

            </td>

        </tr>

        <tr>

            <th>

                Weight

            </th>

            <td>

                ${product["Weight (kg)"] || "-"}

            </td>

        </tr>

        <tr>

            <th>

                Dimensions

            </th>

            <td>

                ${product["Dimensions (cm)"] || "-"}

            </td>

        </tr>

        <tr>

            <th>

                Supplier

            </th>

            <td>

                ${product.Supplier || "-"}

            </td>

        </tr>

    </table>

    <div class="d-flex gap-2 mt-4">

        <a
            href="checkout.html"
            class="btn btn-warning">

            Buy Now

        </a>

        <button
            id="detail-add-cart"
            class="btn btn-dark">

            <i class="bi bi-cart3 me-1"></i>

            Add to Cart

        </button>

    </div>

</div>

`;

}

// ==========================================================
// Detail Cart Event
// ==========================================================

function bindDetailCart(product, salePrice, imageUrl) {

    const button =

        document.getElementById(

            "detail-add-cart"

        );

    if (!button) return;

    button.addEventListener("click", () => {

        app.updateCart(

            sku(product),

            1,

            salePrice,

            name(product),

            imageUrl

        );

        const original = button.innerHTML;

        button.classList.replace(

            "btn-dark",

            "btn-success"

        );

        button.innerHTML = `

<i class="bi bi-check-lg me-1"></i>

Added

`;

        setTimeout(() => {

            button.classList.replace(

                "btn-success",

                "btn-dark"

            );

            button.innerHTML = original;

        }, 1500);

    });

}
// ==========================================================
// Product Specifications
// ==========================================================

function renderSpecifications(product) {

    const details =

        product["Detailed Info"] ||

        "";

    if (!details.trim()) {

        return "";

    }

    return `

<div class="card mt-5 shadow-sm">

    <div class="card-header bg-light">

        <h4 class="mb-0">

            Product Specifications

        </h4>

    </div>

    <div class="card-body p-0">

        <table class="table table-striped table-hover mb-0">

            <tbody>

                ${details

                    .split("|")

                    .map(item => {

                        const parts =

                            item.split(":");

                        if (parts.length < 2) {

                            return "";

                        }

                        const key =

                            parts.shift().trim();

                        const value =

                            parts.join(":").trim();

                        return `

<tr>

    <th style="width:35%">

        ${key}

    </th>

    <td>

        ${value}

    </td>

</tr>

`;

                    })

                    .join("")}

            </tbody>

        </table>

    </div>

</div>

`;

}
