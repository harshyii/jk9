import { api, app, formatINR } from "./core.js";

export async function render(container){
container.innerHTML = `
<div class="row g-3 mb-5">

  <div class="col-6 col-lg-3">
    <a href="#/brands?brand=Eastman" class="text-decoration-none">
      <div class="card border-0 shadow-sm h-100 overflow-hidden">
        <img src="assets/img/hero/eastman.webp"
             class="card-img-top"
             style="height:220px;object-fit:cover;"
             alt="Eastman">
        <div class="card-img-overlay d-flex flex-column justify-content-end bg-dark bg-opacity-50">
          <h4 class="text-white fw-bold mb-1">EASTMAN</h4>
          <small class="text-light">Power Tools</small>
        </div>
      </div>
    </a>
  </div>

  <div class="col-6 col-lg-3">
    <a href="#/brands?brand=Foxcare" class="text-decoration-none">
      <div class="card border-0 shadow-sm h-100 overflow-hidden">
        <img src="assets/img/hero/foxcare.webp"
             class="card-img-top"
             style="height:220px;object-fit:cover;"
             alt="Foxcare">
        <div class="card-img-overlay d-flex flex-column justify-content-end bg-dark bg-opacity-50">
          <h4 class="text-white fw-bold mb-1">FOXCARE</h4>
          <small class="text-light">Car Care</small>
        </div>
      </div>
    </a>
  </div>

  <div class="col-6 col-lg-3">
    <a href="#/products?category=Solar" class="text-decoration-none">
      <div class="card border-0 shadow-sm h-100 overflow-hidden">
        <img src="assets/img/hero/solar.webp"
             class="card-img-top"
             style="height:220px;object-fit:cover;"
             alt="Solar">
        <div class="card-img-overlay d-flex flex-column justify-content-end bg-dark bg-opacity-50">
          <h4 class="text-white fw-bold mb-1">SOLAR</h4>
          <small class="text-light">Panels & Accessories</small>
        </div>
      </div>
    </a>
  </div>

  <div class="col-6 col-lg-3">
    <a href="#/products?category=Industrial" class="text-decoration-none">
      <div class="card border-0 shadow-sm h-100 overflow-hidden">
        <img src="assets/img/hero/industrial.webp"
             class="card-img-top"
             style="height:220px;object-fit:cover;"
             alt="Industrial">
        <div class="card-img-overlay d-flex flex-column justify-content-end bg-dark bg-opacity-50">
          <h4 class="text-white fw-bold mb-1">INDUSTRIAL</h4>
          <small class="text-light">Equipment & Tools</small>
        </div>
      </div>
    </a>
  </div>

</div>
`;

try{
const products=(await api.get("products")).slice(0,9);
const grid=document.getElementById("home-products-feed");

if(!products.length){
grid.innerHTML=`<div class="col-12 text-center py-5 text-muted">No products available.</div>`;
return;
}

grid.innerHTML=products.map(p=>{

const sku=String(
p.ProductID||
p["Product ID"]||
p.SKU||
p.ID||
""
).trim();

const name=p["Item Name"]||p.Name||"Product";
const brand=p.Brand||"";
const price=Number(String(p["Sale Price"]||p.Price||0).replace(/[^\d.]/g,""))||0;
const img=p.Image1||p.Image||"404.webp";

return`
<div class="col-6 col-md-4 col-lg-3">

<div class="card h-100 shadow-sm border-0 rounded-3">

<a href="#/product?id=${encodeURIComponent(sku)}" class="text-decoration-none">

<img
src="${img}"
class="card-img-top p-3"
style="height:220px;object-fit:contain;background:#fafafa"
alt="${name}">

</a>

<div class="card-body d-flex flex-column p-3">

${brand?`<small class="text-muted text-uppercase fw-semibold mb-1">${brand}</small>`:""}

<h6
class="fw-semibold mb-2"
style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:48px;">
${name}
</h6>

<div class="fw-bold text-danger fs-4 mb-3">
${formatINR(price)}
</div>

<div class="mt-auto">

<label class="small text-muted mb-1">Quantity</label>

<div class="input-group input-group-sm mb-3">

<button
class="btn btn-outline-secondary qty-minus"
data-sku="${sku}">
−
</button>

<input
id="qty-${sku}"
class="form-control text-center fw-semibold"
value="1"
readonly>

<button
class="btn btn-outline-secondary qty-plus"
data-sku="${sku}">
+
</button>

</div>

<button
class="btn btn-warning w-100 fw-semibold add-cart mb-2"
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
grid.querySelectorAll(".qty-plus").forEach(btn=>{
btn.onclick=()=>{
const input=document.getElementById("qty-"+btn.dataset.sku);
input.value=parseInt(input.value)+1;
};
});

grid.querySelectorAll(".qty-minus").forEach(btn=>{
btn.onclick=()=>{
const input=document.getElementById("qty-"+btn.dataset.sku);
const q=parseInt(input.value);
if(q>1)input.value=q-1;
};
});

grid.querySelectorAll(".add-cart").forEach(btn=>{
btn.onclick=()=>{

const qty=parseInt(document.getElementById("qty-"+btn.dataset.sku).value);

app.updateCart(
btn.dataset.sku,
qty,
Number(btn.dataset.price),
btn.dataset.name,
btn.dataset.img
);

const old=btn.innerHTML;

btn.classList.remove("btn-warning");
btn.classList.add("btn-success");
btn.innerHTML="✓ Added";

setTimeout(()=>{
btn.classList.remove("btn-success");
btn.classList.add("btn-warning");
btn.innerHTML=old;
},1500);

};
});
}catch(e){

document.getElementById("home-products-feed").innerHTML=`
<div class="col-12">
<div class="alert alert-warning text-center mb-0">
Unable to load products. Please try again later.
</div>
</div>
`;

}
}