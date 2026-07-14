import { api, app, formatINR } from "./core.js";

export async function render(container) {

container.innerHTML = `

<!-- Hero Categories -->

<div class="row g-3 mb-5">

  <div class="col-6 col-lg-3">
    <a href="#/brand?name=Eastman"
       class="card shadow-sm text-decoration-none h-100">
      <div class="card-body d-flex align-items-center gap-3 p-2">

        <img
          src="assets/eastman.webp"
          alt="Eastman"
          style="height:38px;width:90px;object-fit:contain;">

        <div>
          <div class="fw-semibold text-dark">Eastman</div>
          <small class="text-muted">Power Tools</small>
        </div>

      </div>
    </a>
  </div>

  <div class="col-6 col-lg-3">
    <a href="#/brand?name=Foxcare"
       class="card shadow-sm text-decoration-none h-100">
      <div class="card-body d-flex align-items-center gap-3 p-2">

        <img
          src="assets/foxcare.webp"
          alt="Foxcare"
          style="height:38px;width:90px;object-fit:contain;">

        <div>
          <div class="fw-semibold text-dark">Foxcare</div>
          <small class="text-muted">Car Care</small>
        </div>

      </div>
    </a>
  </div>

  <div class="col-6 col-lg-3">
    <a href="#/products?category=Solar"
       class="card shadow-sm text-decoration-none h-100">
      <div class="card-body d-flex align-items-center gap-3 p-2">

        <img
          src="assets/loom.webp"
          alt="Solar"
          style="height:38px;width:90px;object-fit:contain;">

        <div>
          <div class="fw-semibold text-dark">Solar</div>
          <small class="text-muted">Panels</small>
        </div>

      </div>
    </a>
  </div>

  <div class="col-6 col-lg-3">
    <a href="#/products"
       class="card shadow-sm text-decoration-none h-100">
      <div class="card-body d-flex align-items-center gap-3 p-2">

        <img
          src="assets/404.webp"
          alt="Products"
          style="height:38px;width:90px;object-fit:contain;">

        <div>
          <div class="fw-semibold text-dark">All Products</div>
          <small class="text-muted">Browse</small>
        </div>

      </div>
    </a>
  </div>

</div>

<!-- Featured Products -->

<div class="d-flex justify-content-between align-items-center mb-3">

  <h2 class="fw-bold mb-0">
    Featured Products
  </h2>

  <a
    href="#/products"
    class="btn btn-outline-dark">

    View All

  </a>

</div>

<div
class="row g-4"
id="home-products-feed">

  <div class="col-12 text-center py-5">

    <div
      class="spinner-border text-warning">
    </div>

    <p class="text-muted mt-3 mb-0">
      Loading products...
    </p>

  </div>

</div>

`;
try {

const products = await api.get("products");

const list = Array.isArray(products)
  ? products.slice(0, 8)
  : [];

const grid = document.getElementById("home-products-feed");

if (!grid) return;

if (!list.length) {
  grid.innerHTML = `
    <div class="col-12 text-center py-5 text-muted">
      No products available.
    </div>
  `;
  return;
}

grid.innerHTML = list.map(p => {

const sku = String(
p.ProductID ||
p["Product ID"] ||
p.SKU ||
p.ID ||
""
).trim();

const name = p["Item Name"] || p.Name || "Product";

const brand = p.Brand || "";

const price =
Number(
String(
p["Sale Price"] ||
p.Price ||
0
).replace(/[^\d.]/g,"")
) || 0;

const img =
p.Image1 ||
p.Image ||
"assets/404.webp";

return `

<div class="col-6 col-md-4 col-lg-3">

<div class="card h-100 shadow-sm border-0 rounded-3">

<a
href="#/product?id=${encodeURIComponent(sku)}"
class="text-decoration-none">

<img
src="${img}"
class="card-img-top p-3"
style="height:220px;object-fit:contain;background:#fafafa;"
alt="${name}">

</a>

<div class="card-body d-flex flex-column">

${brand ? `
<small class="text-muted text-uppercase fw-semibold mb-1">
${brand}
</small>` : ""}

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

<div class="mt-auto">

<label class="small text-muted">
Quantity
</label>

<div class="input-group input-group-sm mb-3">

<button
class="btn btn-outline-secondary qty-minus"
data-sku="${sku}">

−

</button>

<input
id="qty-${sku}"
class="form-control text-center"
value="1"
readonly>

<button
class="btn btn-outline-secondary qty-plus"
data-sku="${sku}">

+

</button>

</div>

<button
class="btn btn-warning w-100 add-cart mb-2"
data-sku="${sku}"
data-name="${name.replace(/"/g,"&quot;")}"
data-price="${price}"
data-img="${img}">

🛒 Add to Cart

</button>

<a
href="#/product?id=${encodeURIComponent(sku)}"
class="btn btn-outline-secondary w-100">

View Details

</a>

</div>

</div>

</div>

</div>

`;

}).join("");

grid.querySelectorAll(".qty-plus").forEach(btn => {

btn.onclick = () => {

const input =
document.getElementById(
"qty-" + btn.dataset.sku
);

input.value =
parseInt(input.value) + 1;

};

});

grid.querySelectorAll(".qty-minus").forEach(btn => {

btn.onclick = () => {

const input =
document.getElementById(
"qty-" + btn.dataset.sku
);

const qty =
parseInt(input.value);

if (qty > 1)
input.value = qty - 1;

};

});

grid.querySelectorAll(".add-cart").forEach(btn => {

btn.onclick = () => {

const qty =
parseInt(
document.getElementById(
"qty-" + btn.dataset.sku
).value
);

app.updateCart(
btn.dataset.sku,
qty,
Number(btn.dataset.price),
btn.dataset.name,
btn.dataset.img
);

const old = btn.innerHTML;

btn.classList.replace(
"btn-warning",
"btn-success"
);

btn.innerHTML = "✓ Added";

setTimeout(() => {

btn.classList.replace(
"btn-success",
"btn-warning"
);

btn.innerHTML = old;

},1500);

};

});

} catch (e) {

console.error(e);

const grid =
document.getElementById(
"home-products-feed"
);

if (grid) {

grid.innerHTML = `

<div class="col-12">

<div class="alert alert-warning text-center">

Unable to load products.

</div>

</div>

`;

}

}}