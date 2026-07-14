import { api, formatINR } from "./core.js";

export async function render(container){
container.innerHTML=`
<div class="bg-dark text-white rounded p-4 p-md-5 mb-4" style="background:linear-gradient(135deg,#212529,#343a40);">
<div class="row align-items-center">
<div class="col-lg-7">
<h1 class="display-5 fw-bold mb-3">Welcome to JK Enterprises</h1>
<p class="lead text-light opacity-75 mb-4">Find quality tools, electrical products, solar equipment, hardware and industrial supplies at competitive prices.</p>
<a href="#/products" class="btn btn-warning btn-lg fw-semibold">Shop Now</a>
</div>
</div>
</div>

<div class="d-flex justify-content-between align-items-center mb-3">
<h3 class="fw-bold m-0">Featured Products</h3>
<a href="#/products" class="btn btn-outline-dark btn-sm">View All</a>
</div>

<div class="row g-4" id="home-products-feed">
<div class="col-12 text-center py-5">
<div class="spinner-border text-warning"></div>
<p class="mt-3 mb-0 text-muted">Loading products...</p>
</div>
</div>
`;

try{
const products=(await api.get("products")).slice(0,8);
const grid=document.getElementById("home-products-feed");

if(!products.length){
grid.innerHTML=`<div class="col-12 text-center py-5 text-muted">No products available.</div>`;
return;
}

grid.innerHTML=products.map(p=>{

const id=String(
p.ProductID||
p["Product ID"]||
p.SKU||
p["Model Number"]||
p.ID||
""
).trim();

const name=p["Item Name"]||p.Name||"Product";
const brand=p.Brand||"";
const price=Number(String(p["Sale Price"]||p.Price||0).replace(/[^\d.]/g,""))||0;
const image=p.Image1||p.Image||"https://via.placeholder.com/400x400?text=No+Image";

return`
<div class="col-6 col-md-4 col-lg-3">
<div class="card h-100 shadow-sm border-0">

<img src="${image}" class="card-img-top p-3" style="height:220px;object-fit:contain;" alt="${name}">

<div class="card-body d-flex flex-column">

${brand?`<small class="text-muted mb-1">${brand}</small>`:""}

<h6 class="fw-semibold mb-2">${name}</h6>

<div class="mt-auto">

<div class="fs-5 fw-bold text-danger mb-3">${formatINR(price)}</div>

<a href="#/product?id=${encodeURIComponent(id)}" class="btn btn-warning w-100 fw-semibold">
View Product
</a>

</div>

</div>

</div>
</div>
`;

}).join("");

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