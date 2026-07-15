// ==========================================================
// Products
// ==========================================================

import {api,app,formatINR} from "./core.js";

function sku(p){
return String(
p.ProductID||
p["Product ID"]||
p.SKU||
p.ID||
p.Model||
p.ASIN||
""
).trim();
}

function name(p){
return p["Item Name"]||p.Name||"Unnamed Product";
}

function brand(p){
return p.Brand||"";
}

function image(p){
return p.Image1||"assets/404.webp";
}

function price(p){
return Number(String(p["Sale Price"]||p.Price||0).replace(/[^\d.]/g,""))||0;
}

export async function render(container,params){

if(params.id)return renderDetail(container,params.id);

container.innerHTML=`
<div class="row">

<div class="col-lg-3 mb-4">

<div class="card shadow-sm">

<div class="card-body">

<h5 class="mb-3">Products</h5>

<label class="form-label">Sort By</label>

<select id="sort" class="form-select">

<option value="">Default</option>
<option value="low">Price : Low to High</option>
<option value="high">Price : High to Low</option>

</select>

</div>

</div>

</div>

<div class="col-lg-9">

<div class="d-flex justify-content-between align-items-center mb-3">

<h3 class="m-0">
${params.brand ? params.brand + " Products" : "All Products"}
</h3>

</div>

<div class="row g-4" id="catalog-grid">

<div class="col-12 text-center py-5">

<div class="spinner-border text-warning"></div>

<p class="mt-3 mb-0 text-muted">
Loading products...
</p>

</div>

</div>

</div>

</div>
`;

try{

const data=await api.get("products");

const products = Array.isArray(data) ? data : (data.data || []);

let filtered = [...products];

if(params.brand){

filtered = filtered.filter(p =>
String(p.Brand || "").trim().toLowerCase() ===
String(params.brand).trim().toLowerCase()
);

}

const grid = document.getElementById("catalog-grid");

displayGrid(grid, filtered);

document.getElementById("sort").onchange=e=>{

let list=[...filtered];

switch(e.target.value){

case "low":
list.sort((a,b)=>price(a)-price(b));
break;

case "high":
list.sort((a,b)=>price(b)-price(a));
break;

}

displayGrid(grid,list);

};

}catch(err){

console.error(err);

document.getElementById("catalog-grid").innerHTML=`
<div class="col-12">
<div class="alert alert-danger">
Unable to load products.
</div>
</div>
`;

}

}
function displayGrid(target, list){

if(!target){
console.error("catalog-grid not found");
return;
}

if(!list || !list.length){
target.innerHTML=`
<div class="col-12 text-center py-5 text-muted">
No products available.
</div>`;
return;
}

target.innerHTML=list.map(p=>{

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
const img=p.Image1||p.Image||"assets/404.webp";

return`

<div class="col-6 col-md-4 col-lg-3">

<div class="card h-100 shadow-sm border-0 rounded-3">

<a href="#/product?id=${encodeURIComponent(sku)}">

<img
src="${img}"
class="card-img-top p-3"
style="height:220px;object-fit:contain;background:#fafafa">

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

<label class="small text-muted">Quantity</label>

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

target.querySelectorAll(".qty-plus").forEach(btn=>{
btn.onclick=()=>{
const input=document.getElementById("qty-"+btn.dataset.sku);
input.value=parseInt(input.value)+1;
};
});

target.querySelectorAll(".qty-minus").forEach(btn=>{
btn.onclick=()=>{
const input=document.getElementById("qty-"+btn.dataset.sku);
const q=parseInt(input.value);
if(q>1)input.value=q-1;
};
});

target.querySelectorAll(".add-cart").forEach(btn=>{
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

btn.classList.replace("btn-warning","btn-success");
btn.innerHTML="✓ Added";

setTimeout(()=>{
btn.classList.replace("btn-success","btn-warning");
btn.innerHTML=old;
},1500);

};

});

}