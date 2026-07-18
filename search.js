// ==========================================================
// Search
// ==========================================================

import { api, formatINR } from "./core.js";

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

    product.Brand ||

    "";

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

const normalize = value =>

    String(value || "")

        .toLowerCase()

        .normalize("NFKD")

        .replace(/[\u0300-\u036f]/g, "")

        .replace(/[-_/.,()]/g, " ")

        .replace(/\s+/g, " ")

        .trim();

// ==========================================================
// Search Page
// ==========================================================

export async function render(container, params = {}) {

    const query = normalize(params.q);

    container.innerHTML = `

<div class="d-flex justify-content-between align-items-center mb-4">

    <div>

        <h3 class="mb-1">

            Search Results

        </h3>

        <div class="text-muted">

            ${query
                ? `Showing results for "<strong>${query}</strong>"`
                : "All Products"}

        </div>

    </div>

</div>

<div
    id="search-results-grid"
    class="row g-4">

    <div class="col-12 text-center py-5">

        <div class="spinner-border text-warning"></div>

    </div>

</div>

`;

    try {

        const [products, blogs] = await Promise.all([
    api.get("products"),
    api.get("blogs")
]);
const productResults = (Array.isArray(products) ? products : products.data || [])

.filter(product =>

    !query ||

    normalize([

        sku(product),

        name(product),

        brand(product),

        product.Category,

        product.Subcategory,

        product.Description,

        product["Detailed Info"],

        product.SearchKeywords

    ]

    .filter(Boolean)

    .join(" "))

    .includes(query)

);
const blogResults = (Array.isArray(blogs) ? blogs : blogs.data || [])

.filter(blog =>

    !query ||

    normalize([

        blog.BlogID,

        blog.Slug,

        blog.Title,

        blog.Excerpt,

        blog.MetaDescription,

        blog.Category,

        blog.Tags,

        blog.Keywords,

        blog.SearchKeywords

    ]

    .filter(Boolean)

    .join(" "))

    .includes(query)

);

renderGrid(
    document.getElementById("search-results-grid"),
    productResults,
    blogResults
);

    }

    catch (error) {

        console.error(error);

        document.getElementById(

            "search-results-grid"

        ).innerHTML = `

<div class="col-12">

    <div class="alert alert-danger">

        Unable to search products.

    </div>

</div>

`;

    }

}
// ==========================================================
// Search Results Grid
// ==========================================================

function renderGrid(target, products, blogs = []) {

    if (!target) return;

    if (!products.length && !blogs.length) {

        target.innerHTML = `

<div class="col-12 text-center py-5">

    <i class="bi bi-search fs-1 text-muted"></i>

    <h5 class="mt-3">

        No matching products found.

    </h5>

</div>

`;

        return;

    }

    target.innerHTML =

    products.map(product => `

<div class="col-6 col-md-4 col-lg-3">

    <div class="card h-100 shadow-sm border-0 rounded-3">

        <a
            href="product.html?id=${encodeURIComponent(sku(product))}">

            <img
                src="${image(product)}"
                class="card-img-top p-3"
                style="height:220px;object-fit:contain;background:#fafafa"
                alt="${name(product)}">

        </a>

        <div class="card-body d-flex flex-column">

            ${brand(product) ? `

            <small class="text-muted text-uppercase fw-semibold mb-1">

                ${brand(product)}

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

                ${name(product)}

            </h6>

            <div class="fw-bold text-danger fs-5 mb-3">

                ${formatINR(price(product))}

            </div>

            <a
                href="product.html?id=${encodeURIComponent(sku(product))}"
                class="btn btn-warning mt-auto">

                <i class="bi bi-eye me-1"></i>

                View Details

            </a>

        </div>

    </div>

</div>

`).join("")

+

(

blogs.length

?

`

<div class="col-12 mt-5">

    <h4 class="border-bottom pb-2">

        Blog Articles

    </h4>

</div>

${blogs.map(blog => `

<div class="col-12">

    <div class="card shadow-sm">

        <div class="card-body">

            <h5 class="mb-2">

                <a
                    href="blog.html?id=${encodeURIComponent(blog.Slug || blog.BlogID || blog.ID)}"
                    class="text-decoration-none">

                    ${blog.Title}

                </a>

            </h5>

            <p class="text-muted mb-3">

                ${blog.Excerpt || blog.MetaDescription || ""}

            </p>

            <a
                href="blog.html?id=${encodeURIComponent(blog.Slug || blog.BlogID || blog.ID)}"
                class="btn btn-sm btn-outline-warning">

                Read Article

            </a>

        </div>

    </div>

</div>

`).join("")}

`

:

""

);
}