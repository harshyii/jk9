// ==========================================================
// Catalog & Single Product Engineering Module (Zero-Fail SKU)
// ==========================================================
import { api, app, formatINR } from "./core.js";

// Hardened structural fallback key identifier loop
function findSku(p) {
  if (!p) return "N/A";
  
  // 1. Look for any exact or fuzzy match column header
  const targetKey = Object.keys(p).find(key => {
    const cleanKey = key.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    return cleanKey.includes("productidsku") || cleanKey === "sku" || cleanKey === "id";
  });
  
  if (targetKey && String(p[targetKey]).trim()) {
    return String(p[targetKey]).trim();
  }
  
  // 2. Fallback: If no column is found, extract from the start of the text values (e.g., "FPTEEIW0000280")
  const potentialSource = p["Item Name"] || p["name"] || p["Description"] || "";
  const match = String(potentialSource).match(/^[A-Z0-9]+/);
  if (match && match[0].length >= 4) {
    return match[0];
  }
  
  // 3. Absolute Fallback: Generate a clean internal hash out of the item title string index
  const fallbackStr = p["Item Name"] || JSON.stringify(p);
  let hash = 0;
  for (let i = 0; i < fallbackStr.length; i++) {
    hash = (hash << 5) - hash + fallbackStr.charCodeAt(i);
    hash |= 0;
  }
  return "JKE-SKU-" + Math.abs(hash).toString().slice(-6);
}

function getCleanPrice(p) {
  const rawPrice = p["Sale Price"] || p["price"] || "0";
  const matched = String(rawPrice).match(/\d+/);
  return matched ? Number(matched[0]) : 0;
}

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
      if (e.target.value === "low") sorted.sort((a,b) => getCleanPrice(a) - getCleanPrice(b));
      if (e.target.value === "high") sorted.sort((a,b) => getCleanPrice(b) - getCleanPrice(a));
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
  target.innerHTML = list.map(p => {
    const name = p["Item Name"] || p["name"] || "Unnamed Product";
    const sku = findSku(p);
    const brand = p["Brand"] || p["brand"] || "OEM";
    const price = getCleanPrice(p);
    const img = p["Image1"] || p["img"] || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400";

    return `
      <div class="col-6 col-md-4">
        <div class="card h-100 border-0 shadow-sm rounded-0 product-card position-relative">
          <img src="${img}" class="card-img-top rounded-0 p-3 object-fit-contain" style="height:150px; background:#fafafa;" alt="${name}">
          <div class="card-body p-3 d-flex flex-column">
            <h6 class="fw-bold text-truncate text-dark mb-1" title="${name}">${name}</h6>
            <span class="badge bg-light text-dark align-self-start font-monospace mb-2" style="font-size:10px;">${brand}</span>
            <div class="mt-auto">
              <div class="fw-bold text-danger mb-2">${formatINR(price)}</div>
              <a href="#/product?id=${encodeURIComponent(sku)}" class="btn btn-sm btn-outline-dark w-100 rounded-0 font-monospace">Analyze Specs</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

async function renderDetail(container, id) {
  container.innerHTML = `<div class="text-center py-5"><div class="spinner-border text-warning"></div></div>`;
  try {
    const products = await api.get("products");
    const decodedId = decodeURIComponent(id).trim().toLowerCase();
    
    // Scans dynamically using our newly defined findSku routine parameters loop logic
    const p = products.find(item => findSku(item).toLowerCase().includes(decodedId) || decodedId.includes(findSku(item).toLowerCase()));
    
    if (!p) {
      container.innerHTML = `
        <div class="container py-5 text-center">
          <div class="alert alert-warning border-0 rounded-0 shadow-sm mx-auto" style="max-width: 500px;">
            <i class="bi bi-exclamation-triangle text-warning fs-3 d-block mb-2"></i>
            <span class="fw-bold d-block text-dark mb-1">SKU Profile Indexing Fault</span>
            <span class="text-muted small">The identifier <code class="text-danger">${id}</code> does not match our current distribution manifest.</span>
          </div>
          <a href="#/products" class="btn btn-sm btn-dark rounded-0 font-monospace mt-3">Return to Manifest Catalog</a>
        </div>
      `;
      return;
    }

    const name = p["Item Name"] || p["name"] || "Unnamed Product";
    const sku = findSku(p);
    const brand = p["Brand"] || p["brand"] || "OEM";
    const price = getCleanPrice(p);
    const mrp = p["MRP"] ? Number(String(p["MRP"]).replace(/[^\d]/g, '')) : null;
    const img = p["Image1"] || p["img"] || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500";
    const desc = p["Description"] || p["Detailed Info"] || p["desc"] || "No supplementary description provided.";

    container.innerHTML = `
      <div class="row g-4 bg-white p-3 p-md-4 rounded shadow-sm border">
        <div class="col-md-5 text-center">
          <img src="${img}" class="img-fluid p-2 border bg-light object-fit-contain" style="max-height:350px;" alt="${name}">
        </div>
        <div class="col-md-7">
          <span class="badge bg-warning text-dark font-monospace mb-2">${brand}</span>
          <h3 class="fw-bold text-dark">${name}</h3>
          <p class="text-muted font-monospace small">SKU System ID: ${sku}</p>
          <hr class="text-muted">
          <div class="d-flex align-items-baseline gap-3 my-3">
            <h2 class="text-danger fw-bold mb-0">${formatINR(price)}</h2>
            ${mrp ? `<del class="text-muted">${formatINR(mrp)}</del>` : ''}
          </div>
          <p class="text-secondary small my-3">${desc}</p>
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
      app.updateCart(sku, q, price, name, img);
      
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