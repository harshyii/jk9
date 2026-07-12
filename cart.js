// ==========================================================
// Local Procurement Array (Cart Manager) UI Module
// ==========================================================
import { app, formatINR } from "./core.js";

export async function render(container) {
  const drawCart = () => {
    const totals = app.getCartTotals();
    
    if (app.cart.length === 0) {
      container.innerHTML = `
        <div class="bg-white p-5 rounded border shadow-sm text-center">
          <i class="bi bi-cart-x text-muted display-4 mb-3 d-block"></i>
          <h5 class="fw-bold text-dark">Procurement Buffer Empty</h5>
          <p class="text-muted small">No components configured inside allocation matrix streams currently.</p>
          <a href="#/products" class="btn btn-warning rounded-0 fw-bold mt-2">Open Product Catalog</a>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <h4 class="fw-bold text-dark mb-4">Allocation Management Buffer</h4>
      <div class="row g-4">
        <div class="col-lg-8">
          <div class="bg-white border rounded shadow-sm p-3">
            <div class="table-responsive">
              <table class="table align-middle mb-0 small">
                <thead class="table-light font-monospace text-muted">
                  <tr>
                    <th>Item Spec</th>
                    <th class="text-center" style="width:120px;">Units</th>
                    <th class="text-end">Base Price</th>
                    <th class="text-end" style="width: 50px;">Clear</th>
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
            <h6 class="fw-bold text-dark border-bottom pb-2 mb-3">Procurement Calculations Summary</h6>
            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted">Configured Batch Subtotal</span>
              <span class="fw-bold font-monospace text-dark">${formatINR(totals.subtotal)}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted">Estimated Freight Tax / GST</span>
              <span class="text-success fw-bold font-monospace">Inclusive</span>
            </div>
            <hr class="text-muted">
            <div class="d-flex justify-content-between mb-3">
              <h6 class="fw-bold text-dark mb-0">Aggregate Allocation Cost</h6>
              <h5 class="fw-bold font-monospace text-danger mb-0">${formatINR(totals.total)}</h5>
            </div>
            <a href="#/checkout" class="btn btn-warning w-100 rounded-0 fw-bold py-2 font-monospace">Proceed to Forwarding Allocation</a>
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