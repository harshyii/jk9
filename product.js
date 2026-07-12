// ==========================================================
// Catalog & Single Product Engineering Module
// ==========================================================
import { api, app, formatINR } from "./core.js";

export async function render(container, params) {
  if (params.id) {
    return renderDetail(container, params.id);
  }

  container.innerHTML = `
    <div class="row">
      <div class="col-md-3 mb-4">
        <div class="bg-white p-3 shadow-sm border small">
          <h6 class="fw-bold text-dark border-bottom pb-2">Filter Catalog</h6>
          <div class="mb-3">
            <label class="form-label fw-semibold text-muted">Sort Allocations</label>
            <select id="sort-select" class="form-select form-select-sm rounded-0">
              <option value="default">Default Matrix</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>
      <div class="col-md-9">
        <h4 class="fw-bold text-dark mb-4">Complete Inventory Manifest</h4>
        <div class="row g-3" id="catalog-grid">
          <div class="col-12 text-center py-5"><div class="spinner-border text-warning"></div></div>
        </div>
      </div>
    </div>
  `;

  try {
    let items = await api.get("products");
    const grid = document.getElementById("catalog-grid");

    document.getElementById("sort-select").addEventListener("change", (e) => {
      let sorted = [...items];
      if (e.target.value === "low") sorted.sort((a,b) => a.price - b.price);
      if (e.target.value === "high") sorted.sort((a,b) => b.price - a.price);
      displayGrid(grid, sorted);
    });

    displayGrid(grid, items);
  } catch (err) {
    document.getElementById("catalog-grid").innerHTML = `<div class="alert alert-danger">Error loading product inventory database.</div>`;
  }
}

function displayGrid(target, list) {
  if (!list || list.length === 0) {
    target.innerHTML = `<p class="text-muted text-center py-4">No industrial stock matches found.</p>`;
    return;
  }
  target.innerHTML = list.map(p => `
    <div class="col-6 col-md-4">
      <div class="card h-100 border-0 shadow-sm rounded-0 product-card position-relative">
        <img src="${p.img || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400'}" class="card-img-top rounded-0 p-3 object-fit-contain" style="height:150px; background:#fafafa;" alt="${p.name}">
        <div class="card-body p-3 d-flex flex-column">
          <h6 class="fw-bold text-truncate text-dark mb-1">${p.name}</h6>
          <span class="badge bg-light text-dark align-self-start font-monospace mb-2" style="font-size:10px;">${p.brand || 'OEM'}</span>
          <div class="mt-auto">
            <div class="fw-bold text-danger mb-2">${formatINR(p.price)}</div>
            <a href="#/product?id=${p.id}" class="btn btn-sm btn-outline-dark w-100 rounded-0 font-monospace">Analyze Specs</a>
          </div>
        </div>
      </div>
    </div>
  `).join("");
}

async function renderDetail(container, id) {
  container.innerHTML = `<div class="text-center py-5"><div class="spinner-border text-warning"></div></div>`;
  try {
    const p = await api.get("product", { id });
    if (!p || p.error) {
      container.innerHTML = `<div class="alert alert-warning text-center">SKU profile not indexed in factory distribution network.</div>`;
      return;
    }

    container.innerHTML = `
      <div class="row g-4 bg-white p-3 p-md-4 rounded shadow-sm border">
        <div class="col-md-5 text-center">
          <img src="${p.img || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500'}" class="img-fluid p-2 border bg-light object-fit-contain" style="max-height:350px;" alt="${p.name}">
        </div>
        <div class="col-md-7">
          <span class="badge bg-warning text-dark font-monospace mb-2">${p.brand || 'Industrial OEM'}</span>
          <h3 class="fw-bold text-dark">${p.name}</h3>
          <p class="text-muted font-monospace small">Supply Matrix Link Identifier (SKU): ${p.id}</p>
          <hr class="text-muted">
          <div class="d-flex align-items-baseline gap-3 my-3">
            <h2 class="text-danger fw-bold mb-0">${formatINR(p.price)}</h2>
            ${p.mrp ? `<del class="text-muted">${formatINR(p.mrp)}</del> <span class="text-success small fw-bold">Tier Discount Applied</span>` : ''}
          </div>
          <div class="my-3 p-3 bg-light border-start border-warning small">
            <h6 class="fw-bold text-dark"><i class="bi bi-shield-check me-2"></i>Wholesale Trade Terms</h6>
            <ul class="mb-0 ps-3 text-muted">
              <li>Minimum Batch Allocation Order: 1 unit</li>
              <li>GST invoice structure supplied automatically on configuration dispatch</li>
            </ul>
          </div>
          <p class="text-secondary small my-3">${p.desc || 'No supplementary operational technical specification profile provided by manufacturer channel.'}</p>
          <div class="row g-2 align-items-center pt-2">
            <div class="col-3 col-sm-2">
              <input type="number" id="qty-input" class="form-control rounded-0 font-monospace text-center fw-bold" value="1" min="1">
            </div>
            <div class="col-9 col-sm-6">
              <button id="add-to-cart-btn" class="btn btn-dark rounded-0 w-100 fw-bold"><i class="bi bi-cart-plus me-2"></i>Commit To Allocation Batch</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById("add-to-cart-btn").addEventListener("click", () => {
      const q = parseInt(document.getElementById("qty-input").value) || 1;
      app.updateCart(p.id, q, p.price, p.name, p.img);
      
      const btn = document.getElementById("add-to-cart-btn");
      btn.className = "btn btn-success rounded-0 w-100 fw-bold";
      btn.innerHTML = `<i class="bi bi-check-circle me-2"></i>Added to Batch Array`;
      setTimeout(() => {
        btn.className = "btn btn-dark rounded-0 w-100 fw-bold";
        btn.innerHTML = `<i class="bi bi-cart-plus me-2"></i>Commit To Allocation Batch`;
      }, 2000);
    });

  } catch (err) {
    container.innerHTML = `<div class="alert alert-danger">Procurement endpoint connection drop.</div>`;
  }
}