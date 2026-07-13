// ==========================================================
// Storefront Dashboard Matrix View Components
// ==========================================================
import { api, formatINR } from "./core.js";

export async function render(container, params) {
  container.innerHTML = `
    <!-- Hero Corporate Showcase Grid Banner -->
    <div class="p-4 p-md-5 mb-4 rounded text-body-emphasis bg-dark text-light position-relative overflow-hidden shadow-sm" style="background: linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.85));">
      <div class="col-lg-7 px-0 position-relative z-1">
        <h1 class="display-5 fw-bold text-warning">Industrial Wholesale Hub India</h1>
        <p class="lead my-3 text-white-50">Direct commercial factory allocation across verified heavy tools, solar engines, safety apparel arrays, and workshop systems.</p>
        <a href="#/products" class="btn btn-warning fw-bold px-4 py-2 mt-2">Browse Store Catalog</a>
      </div>
    </div>

    <!-- Live Data Processing Feeds Layout Grid Matrix Nodes -->
    <h4 class="fw-bold text-dark border-bottom pb-2 mb-4">Featured B2B Supply Line Tiers</h4>
    <div class="row g-4" id="home-products-feed">
      <div class="col-12 text-center py-4 text-muted"><div class="spinner-grow spinner-grow-sm text-warning me-2"></div>Syncing manufacturing live product array rows...</div>
    </div>
  `;

  try {
    const data = await api.get("products", { limit: "8" });
    const grid = document.getElementById("home-products-feed");
    
    if (!data || data.length === 0) {
      grid.innerHTML = `<div class="col-12 text-center text-muted py-3">No active distribution supply lines exposed currently. Check network metrics.</div>`;
      return;
    }

    grid.innerHTML = data.map(p => {
      // Safely map your exact capitalization headers from the Excel sheet
      const productName = p["Item Name"] || p["name"] || "Unknown Item";
      // Add this line inside the map loop of home.js where it parses the elements:
const productSku = Object.keys(p).find(k => k.toLowerCase().includes("productidsku")) ? p[Object.keys(p).find(k => k.toLowerCase().includes("productidsku"))] : "N/A";
      const productBrand = p["Brand"] || p["brand"] || "OEM";
      const productPrice = Number(p["Sale Price"] || p["price"] || 0);
      const productMrp = p["MRP"] || p["mrp"] ? Number(p["MRP"] || p["mrp"]) : null;
      const productImage = p["Image1"] || p["img"] || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400";

      return `
        <div class="col-6 col-md-4 col-lg-3">
          <div class="card h-100 border-0 shadow-sm rounded-0 product-card position-relative">
            <div class="position-absolute top-0 end-0 bg-warning text-dark font-monospace fw-bold px-2 py-0.5 small z-1">${productBrand}</div>
            <img src="${productImage}" class="card-img-top rounded-0 p-3 object-fit-contain" style="height: 180px; background: #fafafa;" alt="${productName}">
            <div class="card-body d-flex flex-column p-3">
              <h6 class="card-title fw-bold text-dark text-truncate mb-1">${productName}</h6>
              <p class="text-muted small mb-2 font-monospace">SKU: ${productSku}</p>
              <div class="mt-auto">
                <div class="d-flex align-items-baseline gap-2 mb-2">
                  <span class="fs-5 fw-bold text-danger">${formatINR(productPrice)}</span>
                  ${productMrp ? `<del class="text-muted small">${formatINR(productMrp)}</del>` : ''}
                </div>
                <a href="#/product?id=${productSku}" class="btn btn-sm btn-outline-dark w-100 rounded-0 fw-bold">View Procurement Data</a>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join("");
    

  } catch (error) {
    document.getElementById("home-products-feed").innerHTML = `<div class="col-12 alert alert-warning">Network communication layer slow/offline. Dynamic assets deferred.</div>`;
  }
}