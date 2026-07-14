// ==========================================================
// Catalog & Single Product Engineering Module (Robust Sanitizer)
// ==========================================================
import { api, app, formatINR } from "./core.js";

// Extracts clean numeric identifiers out of messy scraper data like "5PC8600"
function sanitizePrice(p) {
  const rawPrice = p["Sale Price"] || p["price"] || "0";
  // Filters out string numbers, looks for matching sequences common to product listings
  const match = String(rawPrice).replace(/[^\d]/g, '');
  if (!match) return 0;
  
  // If scraper appended text fields together like "5PC8600", slice off common prefixes
  if (String(rawPrice).startsWith("5PC") && match.length > 4) {
    return Number(match.substring(1)); // Removes the '5' leaving '8600'
  }
  return Number(match) > 100000 ? Number(String(match).slice(0, 4)) : Number(match);
}

// Scans messy objects to find a valid SKU identifier
function sanitizeSku(p){
return String(
p.ProductID||
p["Product ID"]||
p.SKU||
p["SKU"]||
p.ID||
p["Model Number"]||
p.Model||
p.ASIN||
p.Asin||
""
).trim();
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
    console.log(items);
    console.log(Array.isArray(items));
    const grid = document.getElementById("catalog-grid");

    document.getElementById("sort-select").addEventListener("change", (e) => {
      let sorted = [...items];
      if (e.target.value === "low") sorted.sort((a,b) => sanitizePrice(a) - sanitizePrice(b));
      if (e.target.value === "high") sorted.sort((a,b) => sanitizePrice(b) - sanitizePrice(a));
      displayGrid(grid, sorted);
    });

    displayGrid(grid, items);
  } catch(err){
    console.error(err);
    console.error(err.stack);
    document.getElementById("catalog-grid").innerHTML=
    `<div class="alert alert-danger">${err.message}</div>`;
    }
}

function displayGrid(target, list) {
  if (!list || list.length === 0) {
    target.innerHTML = `<p class="text-muted text-center py-4">No industrial stock matches found.</p>`;
    return;
  }
  target.innerHTML = list.map(p => {
    const name = p["Item Name"] || "Unnamed Product";
    const sku = sanitizeSku(p);
    const brand = p["Brand"] || "OEM";
    const price = sanitizePrice(p);
    const img = p["Image1"] || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400";

    return `
      <div class="col-6 col-md-4">
        <div class="card h-100 border-0 shadow-sm rounded-0 product-card position-relative border-bottom">
          <img src="${img}" class="card-img-top rounded-0 p-3 object-fit-contain" style="height:150px; background:#fafafa;" alt="${name}">
          <div class="card-body p-3 d-flex flex-column">
            <h6 class="fw-bold text-truncate text-dark mb-1" title="${name}">${name}</h6>
            <span class="badge bg-light text-dark align-self-start font-monospace mb-2" style="font-size:10px;">${brand}</span>
            <div class="mt-auto">
              <div class="fw-bold text-danger mb-2">${formatINR(price)}</div>
              <a href="#/product?id=${encodeURIComponent(sku)}" class="btn btn-sm btn-dark w-100 rounded-0 font-monospace">Analyze Specs</a>
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
    
    const p = products.find(item => sanitizeSku(item).toLowerCase() === decodedId || sanitizeSku(item).toLowerCase().includes(decodedId));
    
    if (!p) {
      container.innerHTML = `<div class="alert alert-warning text-center my-5">SKU [${id}] not found inside catalog mappings.</div>`;
      return;
    }

    const name = p["Item Name"] || "Unnamed Product";
    const sku = sanitizeSku(p);
    const brand = p["Brand"] || "OEM";
    const price = sanitizePrice(p);
    const desc = p["Description"] || "No secondary information provided.";
    
    // Dynamically look through columns Image1 to Image8 to extract active URLs
    let images = [];
    for (let i = 1; i <= 8; i++) {
      if (p[`Image${i}`] && String(p[`Image${i}`]).startsWith("http")) {
        images.push(p[`Image${i}`]);
      }
    }
    if (images.length === 0) images.push("https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500");

    // Render image gallery markup dynamically
    const mainImgHtml = `<img id="main-product-frame" src="${images[0]}" class="img-fluid border bg-light p-3 object-fit-contain w-100" style="height:350px;" alt="${name}">`;
    const thumbsHtml = images.map((img, idx) => `
      <div class="col-3">
        <img src="${img}" class="img-fluid border p-1 thumbnail-clickable style="height:60px; cursor:pointer;" onclick="document.getElementById('main-product-frame').src='${img}'" alt="thumb">
      </div>
    `).join("");

    container.innerHTML = `
      <div class="row g-4 bg-white p-3 p-md-4 rounded shadow-sm border">
        <div class="col-md-5">
          ${mainImgHtml}
          <div class="row g-2 mt-2">${thumbsHtml}</div>
        </div>
        <div class="col-md-7">
          <span class="badge bg-warning text-dark font-monospace mb-2">${brand}</span>
          <h3 class="fw-bold text-dark">${name}</h3>
          <p class="text-muted font-monospace small">Verified System SKU: <b class="text-dark">${sku}</b></p>
          <hr class="text-muted">
          <div class="d-flex align-items-baseline gap-3 my-3">
            <h2 class="text-danger fw-bold mb-0">${formatINR(price)}</h2>
          </div>
          <p class="text-secondary small my-3" style="white-space: pre-line;">${desc}</p>
          <div class="row g-2 align-items-center pt-2">
            <div class="col-3 col-sm-2">
              <input type="number" id="qty-input" class="form-control rounded-0 font-monospace text-center fw-bold" value="1" min="1">
            </div>
            <div class="col-9 col-sm-6">
              <button id="add-to-cart-btn" class="btn btn-dark rounded-0 w-100 fw-bold"><i class="bi bi-cart-plus me-2"></i>Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Connect image carousel swap logic manually to explicitly catch inline event handling drops
    const thumbElements = container.querySelectorAll('.row.g-2.mt-2 img');
    thumbElements.forEach(thumb => {
      thumb.addEventListener('click', (e) => {
        document.getElementById('main-product-frame').src = e.target.src;
      });
    });

    document.getElementById("add-to-cart-btn").addEventListener("click", () => {
      const q = parseInt(document.getElementById("qty-input").value) || 1;
      app.updateCart(sku, q, price, name, images[0]);
      
      const btn = document.getElementById("add-to-cart-btn");
      btn.className = "btn btn-success rounded-0 w-100 fw-bold";
      btn.innerHTML = `<i class="bi bi-check-circle me-2"></i>Added to Cart`;
      setTimeout(() => {
        btn.className = "btn btn-dark rounded-0 w-100 fw-bold";
        btn.innerHTML = `<i class="bi bi-cart-plus me-2"></i>Add to Cart`;
      }, 2000);
    });

  } catch (err) {
    container.innerHTML = `<div class="alert alert-danger">Procurement data matrix loading drop: ${err.message}</div>`;
  }
}