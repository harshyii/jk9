// ==========================================================
// Local Procurement Array (Cart Manager) UI Module
// ==========================================================
import { app, api, formatINR } from "./core.js";

export async function render(container) {
  const drawCart = () => {
    const totals = app.getCartTotals();
    
    if (app.cart.length === 0) {
     container.innerHTML=`
      <div class="text-center py-5">

      <i class="bi bi-cart-x display-4 text-muted"></i>

      <h3 class="mt-3">Your Cart is Empty</h3>

      <p class="text-muted">
      Looks like you haven't added any products yet.
      </p>

      <a href="#/products"
      class="btn btn-warning fw-semibold mb-5">
      Continue Shopping
      </a>

      <hr class="my-5">

      <h4 class="text-start fw-bold mb-4">
      ⭐ Popular Products
      </h4>

      <div class="row g-4" id="suggested-products">

      <div class="col-12 text-center">

      <div class="spinner-border text-warning"></div>

      </div>

      </div>

      </div>
      `;

      const products=(await api.get("products")).slice(0,4);

document.getElementById("suggested-products").innerHTML=
products.map(p=>`

<div class="col-6 col-md-3">

<div class="card h-100 shadow-sm">

<img
src="${p.Image1||'assets/404.webp'}"
class="card-img-top p-3"
style="height:170px;object-fit:contain;">

<div class="card-body d-flex flex-column">

<h6 class="small fw-semibold">
${p["Item Name"]}
</h6>

<div class="text-danger fw-bold mb-2">
${formatINR(Number(p["Sale Price"]||0))}
</div>

<div class="input-group input-group-sm mb-2">

<button class="btn btn-outline-secondary qty-minus"
data-sku="${p.ProductID||p.SKU}">
−
</button>

<input
id="qty-${p.ProductID||p.SKU}"
class="form-control text-center"
value="1"
readonly>

<button class="btn btn-outline-secondary qty-plus"
data-sku="${p.ProductID||p.SKU}">
+
</button>

</div>

<button
class="btn btn-warning add-cart mb-2"
data-sku="${p.ProductID||p.SKU}"
data-name="${(p["Item Name"]||"").replace(/"/g,"&quot;")}"
data-price="${Number(p["Sale Price"]||0)}"
data-img="${p.Image1||""}">
🛒 Add to Cart
</button>

<a
href="#/product?id=${encodeURIComponent(p.ProductID||p.SKU)}"
class="btn btn-outline-dark">
View Details
</a>

</div>

</div>

</div>

`).join("");

// Quantity +
container.querySelectorAll(".qty-plus").forEach(btn=>{
btn.onclick=()=>{

const input=document.getElementById("qty-"+btn.dataset.sku);

input.value=parseInt(input.value)+1;

};
});

// Quantity -
container.querySelectorAll(".qty-minus").forEach(btn=>{
btn.onclick=()=>{

const input=document.getElementById("qty-"+btn.dataset.sku);

const q=parseInt(input.value);

if(q>1)input.value=q-1;

};
});

// Add to cart
container.querySelectorAll(".add-cart").forEach(btn=>{
btn.onclick=()=>{

const qty=parseInt(
document.getElementById("qty-"+btn.dataset.sku).value
);

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

      return;
    }

    container.innerHTML = `
      <h4 class="fw-bold text-dark mb-4">Shopping Cart</h4>
      <div class="row g-4">
        <div class="col-lg-8">
          <div class="bg-white border rounded shadow-sm p-3">
            <div class="table-responsive">
              <table class="table align-middle mb-0 small">
                <thead class="table-light font-monospace text-muted">
                  <tr>
                    <th>Product</th>
                    <th class="text-center" style="width:120px;">Quantity</th>
                    <th class="text-end">Total</th>
                    <th class="text-end" style="width: 50px;">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  ${app.cart.map(i => `
                    <tr>
                      <td>
                        <div class="d-flex align-items-center gap-2">
                          <img src="${i.img || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=80'}" style="width:40px;height:40px;" class="object-fit-contain border bg-light p-1" alt="${i.name}">
                          <div>
                            <h6 class="mb-0 fw-bold text-dark text-truncate" style="max-width:220px;">${i.name}</h6>
                            <small class="text-muted font-monospace" style="font-size:10px;">SKU: ${i.id}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="input-group input-group-sm">
                          <button class="btn btn-outline-secondary px-2 dec-btn" data-id="${i.id}" data-q="${i.q}"><i class="bi bi-dash"></i></button>
                          <input type="text" class="form-control text-center fw-bold bg-white border font-monospace qty-view" value="${i.q}" readonly>
                          <button class="btn btn-outline-secondary px-2 inc-btn" data-id="${i.id}" data-q="${i.q}"><i class="bi bi-plus"></i></button>
                        </div>
                      </td>
                      <td class="text-end fw-bold font-monospace text-dark">${formatINR(i.price * i.q)}</td>
                      <td class="text-center"><button class="btn btn-sm btn-link text-danger p-0 del-btn" data-id="${i.id}"><i class="bi bi-trash3"></i></button></td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="bg-white border rounded shadow-sm p-3 small">
            <h6 class="fw-bold text-dark border-bottom pb-2 mb-3">Order Summary</h6>
            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted">Subtotal</span>
              <span class="fw-bold font-monospace text-dark">${formatINR(totals.subtotal)}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted">Shipping</span>
              <span class="text-success fw-bold font-monospace">Free</span>
            </div>
            <hr class="text-muted">
            <div class="d-flex justify-content-between mb-3">
              <h6 class="fw-bold text-dark mb-0">Total</h6>
              <h5 class="fw-bold font-monospace text-danger mb-0">${formatINR(totals.total)}</h5>
            </div>
            <a href="#/checkout" class="btn btn-warning w-100 rounded-0 fw-bold py-2 font-monospace">Proceed to Checkout</a>
          </div>
        </div>
      </div>
    `;

    // Hook listeners up instantly using selective click mapping loops
    container.querySelectorAll(".dec-btn").forEach(b => b.addEventListener("click", () => {
      const id = b.getAttribute("data-id");
      const currentQ = parseInt(b.getAttribute("data-q"));
      app.updateCart(id, currentQ - 1);
      drawCart();
    }));

    container.querySelectorAll(".inc-btn").forEach(b => b.addEventListener("click", () => {
      const id = b.getAttribute("data-id");
      const currentQ = parseInt(b.getAttribute("data-q"));
      const targetItem = app.cart.find(item => item.id === id);
      app.updateCart(id, currentQ + 1, targetItem.price, targetItem.name, targetItem.img);
      drawCart();
    }));

    container.querySelectorAll(".del-btn").forEach(b => b.addEventListener("click", () => {
      app.updateCart(b.getAttribute("data-id"), 0);
      drawCart();
    }));
  };

  drawCart();
}