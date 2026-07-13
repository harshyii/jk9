// ==========================================================
// B2B Wholesale Allocation Checkout Controller
// ==========================================================
import { app, api, formatINR, CONFIG } from "./core.js";

export async function render(container) {
  const cart = app.getCart();
  
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-center py-5 bg-white border border-dashed rounded shadow-sm">
        <i class="bi bi-cart-x fs-1 text-muted d-block mb-2"></i>
        <h5 class="fw-bold">Procurement Manifest Empty</h5>
        <p class="text-muted small">Add industrial components inside catalog matrices before testing checkout vectors.</p>
        <a href="#/products" class="btn btn-sm btn-dark rounded-0 font-monospace mt-2">Open Product Catalog</a>
      </div>
    `;
    return;
  }

  let subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  let codCharge = 0; // Configured for wholesale invoice parameters
  let total = subtotal + codCharge;

  const orderItemsHtml = cart.map(item => `
    <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2 small">
      <div>
        <span class="fw-bold text-dark d-block">${item.name.substring(0,35)}...</span>
        <span class="text-muted font-monospace font-size:11px;">SKU: ${item.sku} × ${item.qty}</span>
      </div>
      <span class="fw-bold text-secondary">${formatINR(item.price * item.qty)}</span>
    </div>
  `).join("");

  container.innerHTML = `
    <div class="row g-4">
      <div class="col-md-7">
        <div class="bg-white p-4 rounded shadow-sm border">
          <h5 class="fw-bold text-dark mb-3">Corporate Logistics & Billing Matrix</h5>
          <form id="checkout-form">
            <div class="mb-3">
              <label class="form-label small fw-bold text-muted">Legal Corporate Entity Name</label>
              <input type="text" id="cust-name" class="form-control rounded-0" required placeholder="e.g., JK Spares Pvt Ltd">
            </div>
            <div class="mb-3">
              <label class="form-label small fw-bold text-muted">Active Authorized Contact Phone</label>
              <input type="tel" id="cust-phone" class="form-control rounded-0" required placeholder="10-digit primary mobile">
            </div>
            <div class="mb-3">
              <label class="form-label small fw-bold text-muted">Complete Commercial Destination Address</label>
              <textarea id="cust-address" class="form-control rounded-0" rows="3" required placeholder="Include GSTIN details if applicable..."></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label small fw-bold text-muted">Settlement Vector Option</label>
              <select id="payment-method" class="form-select rounded-0">
                <option value="UPI Direct Clearance">UPI Direct Clearance (Instant Order Dispatch)</option>
                <option value="Cash On Delivery">Cash On Delivery (Wholesale Terms Apply)</option>
              </select>
            </div>
            <button type="submit" id="submit-order-btn" class="btn btn-dark rounded-0 w-100 fw-bold py-2 font-monospace">Authorize Procurement Invoice</button>
          </form>
        </div>
      </div>
      <div class="col-md-5">
        <div class="bg-white p-4 rounded shadow-sm border position-sticky" style="top:20px;">
          <h5 class="fw-bold text-dark border-bottom pb-2 mb-3">Item Allocations Manifest</h5>
          ${orderItemsHtml}
          <div class="d-flex justify-content-between fw-bold fs-5 text-danger pt-2 mt-3 border-top">
            <span>Total Value:</span>
            <span>${formatINR(total)}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById("checkout-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const btn = document.getElementById("submit-order-btn");
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Syncing Order to Sheet Clusters...`;

    const orderPayload = {
      customerName: document.getElementById("cust-name").value.trim(),
      phone: document.getElementById("cust-phone").value.trim(),
      address: document.getElementById("cust-address").value.trim(),
      paymentMethod: document.getElementById("payment-method").value,
      subtotal: subtotal,
      codCharge: codCharge,
      total: total,
      items: cart.map(i => ({ sku: i.sku, name: i.name, qty: i.qty, lineTotal: i.price * i.qty }))
    };

    // 1. Post to your Google Sheets database script via JSON payload mapping
    const res = await api.post("order", orderPayload);
    const generatedRefId = res.success ? res.orderId : "JKE-TEMP-" + Math.floor(10000 + Math.random()*90000);

    // 2. Format a structured text message containing the order breakdown
    let itemManifestString = "";
    cart.forEach((item, idx) => {
      itemManifestString += `${idx + 1}. SKU: ${item.sku} | Qty: ${item.qty} | Value: ${formatINR(item.price * item.qty)}\n`;
    });

    const whatsappMessage = `Hello ${CONFIG.NAME},\n\n` +
      `I have remitted payment/placed an order for Industrial Order Token: *${generatedRefId}*.\n\n` +
      `*─── PURCHASE ORDER MANIFEST ───*\n` +
      `${itemManifestString}\n` +
      `*Total Invoice Amount:* ${formatINR(total)}\n` +
      `*Payment Route Selected:* ${orderPayload.paymentMethod}\n\n` +
      `*─── CUSTOMER BILLING LOGISTICS ───*\n` +
      `Entity Name: ${orderPayload.customerName}\n` +
      `Phone: ${orderPayload.phone}\n` +
      `Delivery Destination:\n${orderPayload.address}\n\n` +
      `Attached is my clearance transaction statement snapshot. Please clear allocation path tracking vectors.`;

    // 3. Clear shopping data structures and redirect execution routes safely out to the WhatsApp gateway API
    app.clearCart();
    
    const encodedUrl = `https://api.whatsapp.com/send?phone=${CONFIG.WHATSAPP}&text=${encodeURIComponent(whatsappMessage)}`;
    window.location.href = encodedUrl;
  });
}