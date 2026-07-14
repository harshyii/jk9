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
    const products = await api.get("products");

  const match = products.filter(p =>
  (p.Brand || "").toLowerCase() === brandName.toLowerCase()
  );
    const grid = document.getElementById("brand-filtered-grid");

    if(!match || match.length === 0) {
      grid.innerHTML = `<div class="col-12 text-center text-muted py-4">No allocations found for this supply vector channel currently.</div>`;
      return;
    }

    grid.innerHTML = match.map(p => {

const sku = String(
  p.ProductID ||
  p["Product ID"] ||
  p.SKU ||
  p.ID ||
  ""
).trim();

const name = p["Item Name"] || p.Name || "Product";

const img = p.Image1 || p.Image || "404.webp";

const price =
Number(
String(
p["Sale Price"] ||
p.Price ||
0
).replace(/[^\d.]/g,"")
) || 0;

return `

<div class="col-6 col-md-4 col-lg-3">

<div class="card h-100 shadow-sm border-0 rounded-3">

<a href="#/product?id=${encodeURIComponent(sku)}">

<img
src="${img}"
class="card-img-top p-3"
style="height:220px;object-fit:contain;background:#fafafa;"
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

<div class="fw-bold text-danger fs-5 mb-3">

${formatINR(price)}

</div>

<a
href="#/product?id=${encodeURIComponent(sku)}"
class="btn btn-dark w-100">

View Details

</a>

</div>

</div>

</div>

`;

}).join("");
  } catch (err) {
    document.getElementById("brand-filtered-grid").innerHTML = `<div class="alert alert-danger">Communication drop parsing channel rows.</div>`;
  }
}