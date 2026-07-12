// ==========================================================
// Search Index Core Processing Array Module
// ==========================================================
import { api, formatINR } from "./core.js";

export async function render(container, params) {
  const query = params.q || "";
  container.innerHTML = `
    <h4 class="fw-bold text-dark mb-3">Search Metric Results</h4>
    <p class="text-muted small mb-4">Parameters queried: <span class="badge bg-dark font-monospace">${query || 'All Assets'}</span></p>
    <div class="row g-3" id="search-results-grid">
      <div class="col-12 text-center py-5"><div class="spinner-border text-warning"></div></div>
    </div>
  `;

  try {
    const hits = await api.get("search", { q: query });
    const grid = document.getElementById("search-results-grid");

    if (!hits || hits.length === 0) {
      grid.innerHTML = `<div class="col-12 text-center text-muted py-5"><i class="bi bi-exclamation-diamond fs-2 text-warning d-block mb-2"></i>Zero records found matching query parameters within internal inventory layers.</div>`;
      return;
    }

    grid.innerHTML = hits.map(p => `
      <div class="col-6 col-md-4 col-lg-3">
        <div class="card h-100 border-0 shadow-sm rounded-0 product-card">
          <img src="${p.img || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400'}" class="card-img-top rounded-0 p-3 object-fit-contain" style="height:140px; background:#fafafa;" alt="${p.name}">
          <div class="card-body p-3 d-flex flex-column">
            <span class="text-muted font-monospace small d-block mb-1" style="font-size:10px;">${p.brand || 'OEM'}</span>
            <h6 class="fw-bold text-dark text-truncate mb-1">${p.name}</h6>
            <div class="mt-auto">
              <div class="text-danger fw-bold mb-2">${formatINR(p.price)}</div>
              <a href="#/product?id=${p.id}" class="btn btn-sm btn-outline-dark w-100 rounded-0">Analyze</a>
            </div>
          </div>
        </div>
      </div>
    `).join("");
  } catch (err) {
    document.getElementById("search-results-grid").innerHTML = `<div class="alert alert-danger">Error indexing structural database entries.</div>`;
  }
}