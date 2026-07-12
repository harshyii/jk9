// ==========================================================
// Manufacturer Brand Index Filtering System Module
// ==========================================================
import { api, formatINR } from "./core.js";

export async function render(container, params) {
  if (params.name) {
    return renderBrandProducts(container, params.name);
  }

  container.innerHTML = `
    <h4 class="fw-bold text-dark border-bottom pb-2 mb-4">Contracted Manufacturer Network</h4>
    <div class="row g-3" id="brands-index-grid">
      <div class="col-12 text-center py-5"><div class="spinner-border text-warning"></div></div>
    </div>
  `;

  try {
    const manufacturers = await api.get("brands");
    const grid = document.getElementById("brands-index-grid");
    
    if(!manufacturers || manufacturers.length === 0) {
      grid.innerHTML = `<p class="text-muted text-center py-3">No OEM channels broadcasted.</p>`;
      return;
    }

    grid.innerHTML = manufacturers.map(b => `
      <div class="col-6 col-sm-4 col-md-3">
        <a href="#/brand?name=${encodeURIComponent(b)}" class="card text-decoration-none border shadow-sm p-4 text-center h-100 bg-white rounded-0 transition-element">
          <i class="bi bi-building text-warning fs-2 mb-2"></i>
          <h6 class="fw-bold text-dark mb-1 text-truncate">${b}</h6>
          <span class="text-muted font-monospace small text-uppercase" style="font-size:10px;">Authorized Channel</span>
        </a>
      </div>
    `).join("");
  } catch (err) {
    document.getElementById("brands-index-grid").innerHTML = `<div class="alert alert-danger">Error linking to brand matrix network node.</div>`;
  }
}

async function renderBrandProducts(container, brandName) {
  container.innerHTML = `<h4 class="fw-bold text-dark mb-4">Pipeline: ${brandName}</h4><div class="row g-3" id="brand-filtered-grid"><div class="col-12 text-center py-5"><div class="spinner-border text-warning"></div></div></div>`;
  
  try {
    const match = await api.get("products", { brand: brandName });
    const grid = document.getElementById("brand-filtered-grid");

    if(!match || match.length === 0) {
      grid.innerHTML = `<div class="col-12 text-center text-muted py-4">No allocations found for this supply vector channel currently.</div>`;
      return;
    }

    grid.innerHTML = match.map(p => `
      <div class="col-6 col-md-4 col-lg-3">
        <div class="card h-100 border-0 shadow-sm rounded-0 product-card">
          <img src="${p.img || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400'}" class="card-img-top rounded-0 p-3 object-fit-contain" style="height:150px; background:#fafafa;" alt="${p.name}">
          <div class="card-body p-3 d-flex flex-column">
            <h6 class="fw-bold text-dark text-truncate mb-1">${p.name}</h6>
            <div class="mt-auto">
              <div class="text-danger fw-bold mb-2">${formatINR(p.price)}</div>
              <a href="#/product?id=${p.id}" class="btn btn-sm btn-dark w-100 rounded-0 font-monospace">Open Specs</a>
            </div>
          </div>
        </div>
      </div>
    `).join("");
  } catch (err) {
    document.getElementById("brand-filtered-grid").innerHTML = `<div class="alert alert-danger">Communication drop parsing channel rows.</div>`;
  }
}