// ==========================================================
// Search
// ==========================================================

import { api, formatINR } from "./core.js";

function sku(p) {
  return String(
    p.ProductID ||
    p["Product ID"] ||
    p.SKU ||
    p.ID ||
    p.Model ||
    p.ASIN ||
    ""
  ).trim();
}

function name(p) {
  return p["Item Name"] || p.Name || "Unnamed Product";
}

function brand(p) {
  return p.Brand || "";
}

function image(p) {
  return p.Image1 || "assets/404.webp";
}

function price(p) {
  return Number(
    String(p["Sale Price"] || p.Price || 0).replace(/[^\d.]/g, "")
  ) || 0;
}

export async function render(container, params) {

  const query = (params.q || "").trim().toLowerCase();

  container.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h3 class="mb-1">Search Results</h3>
        <div class="text-muted">
          ${query ? `Showing results for "<strong>${query}</strong>"` : "All Products"}
        </div>
      </div>
    </div>

    <div class="row g-4" id="search-results-grid">
      <div class="col-12 text-center py-5">
        <div class="spinner-border text-warning"></div>
      </div>
    </div>
  `;

  try {

    const data = await api.get("products");

    const products = Array.isArray(data)
      ? data
      : (data.data || []);

    let results = products;

    if (query) {

      results = products.filter(p => {

        return [
          sku(p),
          name(p),
          brand(p),
          p.Category,
          p.Subcategory,
          p.Description,
          p["Detailed Info"]
        ]
        .join(" ")
        .toLowerCase()
        .includes(query);

      });

    }

    displayGrid(
      document.getElementById("search-results-grid"),
      results
    );

  } catch (err) {

    console.error(err);

    document.getElementById("search-results-grid").innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger">
          Unable to search products.
        </div>
      </div>
    `;

  }

}

function displayGrid(target, list) {

  if (!list.length) {

    target.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-search fs-1 text-muted"></i>
        <h5 class="mt-3">No matching products found.</h5>
      </div>
    `;

    return;
  }

  target.innerHTML = list.map(p => {

    const id = sku(p);

    return `
      <div class="col-6 col-md-4 col-lg-3">

        <div class="card h-100 shadow-sm border-0 rounded-3">

          <a href="#/product?id=${encodeURIComponent(id)}">

            <img
              src="${image(p)}"
              class="card-img-top p-3"
              style="height:220px;object-fit:contain;background:#fafafa;">

          </a>

          <div class="card-body d-flex flex-column">

            ${
              brand(p)
                ? `<small class="text-muted text-uppercase">${brand(p)}</small>`
                : ""
            }

            <h6
              class="fw-semibold mt-1"
              style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:48px;">

              ${name(p)}

            </h6>

            <div class="fw-bold text-danger fs-5 mb-3">
              ${formatINR(price(p))}
            </div>

            <a
              href="#/product?id=${encodeURIComponent(id)}"
              class="btn btn-warning mt-auto">

              View Details

            </a>

          </div>

        </div>

      </div>
    `;

  }).join("");

}