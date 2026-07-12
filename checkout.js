// ==========================================================
// Procurement Order Placement System Matrix & UPI QR Gateway
// ==========================================================
import { app, api, formatINR, getUPIString } from "./core.js";

export async function render(container) {
  let totals = app.getCartTotals(false);
  
  if (app.cart.length === 0) {
    container.innerHTML = `<div class="alert alert-warning text-center small my-4">No active elements stored inside buffer fields to checkout.</div>`;
    return;
  }

  const renderForm = () => {
    container.innerHTML = `
      <h4 class="fw-bold text-dark mb-4">Wholesale Logistics Procurement Forms</h4>
      <div class="row g-4 small">
        <div class="col-lg-7">
          <div class="bg-white border p-3 rounded shadow-sm">
            <h6 class="fw-bold text-dark border-bottom pb-2 mb-3">Firm / Consignee Delivery Vector Data</h6>
            <form id="checkout-form">
              <div class="row g-2">
                <div class="col-12"><label class="form-label fw-semibold">Legal Enterprise / Individual Name</label><input type="text" class="form-control form-control-sm rounded-0" name="name" required></div>
                <div class="col-md-6"><label class="form-label fw-semibold">Contact Mobile Number</label><input type="tel" class="form-control form-control-sm rounded-0" name="phone" pattern="[0-9]{10}" placeholder="10-digit primary channel phone number" required></div>
                <div class="col-md-6"><label class="form-label fw-semibold">Corporate Communications Email</label><input type="email" class="form-control form-control-sm rounded-0" name="email" required></div>
                <div class="col-12"><label class="form-label fw-semibold">Complete Destination Shipping Address</label><textarea class="form-control form-control-sm rounded-0" name="address" rows="3" placeholder="Enter clean yard/factory unloading site destination details" required></textarea></div>
                <div class="col-md-6"><label class="form-label fw-semibold">State / Region Hub</label><input type="text" class="form-control form-control-sm rounded-0" name="state" required></div>
                <div class="col-md-6"><label class="form-label fw-semibold">Postal Pincode Allocation</label><input type="text" class="form-control form-control-sm rounded-0" name="pincode" pattern="[0-9]{6}" required></div>
                <div class="col-12"><label class="form-label fw-semibold">Firm GSTIN Identifier <span class="text-muted">(Optional)</span></label><input type="text" class="form-control form-control-sm rounded-0 font-monospace text-uppercase" name="gstin" placeholder="22AAAAA0000A1Z5"></div>
              </div>
              
              <h6 class="fw-bold text-dark border-bottom pb-2 mt-4 mb-2">Select Clearance Remittance Method</h6>
              <div class="p-2 border bg-light mb-3 d-flex flex-column gap-2">
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="payment" id="pay-upi" value="UPI" checked>
                  <label class="form-check-label fw-bold text-dark" for="pay-upi"><i class="bi bi-qr-code-scan me-2 text-primary"></i>Immediate Digital Settlement (Instant UPI Dispatch)</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="payment" id="pay-cod" value="COD">
                  <label class="form-check-label fw-semibold text-muted" for="pay-cod"><i class="bi bi-truck me-2"></i>COD / Logistics Cache (Incurs 5% Handling Fee)</label>
                </div>
              </div>
              <button type="submit" id="submit-order-btn" class="btn btn-warning w-100 rounded-0 fw-bold font-monospace py-2 mt-2">Transmit Final Procurement Request Vector</button>
            </form>
          </div>
        </div>
        
        <div class="col-lg-5">
          <div class="bg-white border p-3 rounded shadow-sm">
            <h6 class="fw-bold text-dark border-bottom pb-2 mb-3">Configured Batch Breakdown</h6>
            <div style="max-height: 200px; overflow-y:auto;" class="mb-3 border-bottom pb-2">
              ${app.cart.map(i => `
                <div class="d-flex justify-content-between align-items-center mb-2 pe-1">
                  <div class="text-truncate" style="max-width: 70%;"><span class="fw-bold text-dark font-monospace">[x${i.q}]</span> ${i.name}</div>
                  <span class="font-monospace text-muted">${formatINR(i.price * i.q)}</span>
                </div>
              `).join("")}
            </div>
            <div class="d-flex justify-content-between mb-1"><span class="text-muted">Batch Subtotal</span><span class="font-monospace text-dark">${formatINR(totals.subtotal)}</span></div>
            <div id="cod-fee-row" class="d-flex justify-content-between mb-1 d-none"><span class="text-muted">COD Logistics Surcharge</span><span class="font-monospace text-danger" id="cod-fee-val">₹0</span></div>
            <div class="d-flex justify-content-between mt-2 pt-2 border-top"><h6 class="fw-bold text-dark mb-0">Final Allocation Sum</h6><h5 class="fw-bold font-monospace text-danger mb-0" id="final-total-val">${formatINR(totals.total)}</h5></div>
          </div>
        </div>
      </div>
    `;

    // Dynamic handling adjustments depending on active payment configurations selection state
    const checkoutForm = document.getElementById("checkout-form");
    checkoutForm.querySelectorAll('input[name="payment"]').forEach(r => r.addEventListener("change", (e) => {
      const isCOD = e.target.value === "COD";
      totals = app.getCartTotals(isCOD);
      
      const codRow = document.getElementById("cod-fee-row");
      if (isCOD) {
        codRow.classList.remove("d-none");
        document.getElementById("cod-fee-val").innerText = formatINR(totals.codFee);
      } else {
        codRow.classList.add("d-none");
      }
      document.getElementById("final-total-val").innerText = formatINR(totals.total);
    }));

    checkoutForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = document.getElementById("submit-order-btn");
      btn.disabled = true;
      btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Transmitting secure payload...`;

      const fd = new FormData(checkoutForm);
      const payload = {
        customer: {
          name: fd.get("name"),
          phone: fd.get("phone"),
          email: fd.get("email"),
          address: fd.get("address"),
          state: fd.get("state"),
          pincode: fd.get("pincode"),
          gstin: fd.get("gstin")
        },
        items: app.cart,
        summary: totals,
        paymentMethod: fd.get("payment")
      };

      try {
        const response = await api.post("order", payload);
        if (response && response.success) {
          if (payload.paymentMethod === "UPI") {
            renderUPIView(response.refId, totals.total, payload.customer.phone);
          } else {
            renderSuccessView(response.refId);
          }
        } else {
          alert("Error: " + (response.error || "Backend verification breakdown."));
          btn.disabled = false;
          btn.innerText = `Transmit Final Procurement Request Vector`;
        }
      } catch (err) {
        alert("Fatal infrastructure submission fault.");
        btn.disabled = false;
        btn.innerText = `Transmit Final Procurement Request Vector`;
      }
    });
  };

  const renderUPIView = (refId, finalAmt, customerPhone) => {
    container.innerHTML = `
      <div class="bg-white p-4 rounded border shadow-sm text-center mx-auto small" style="max-width: 500px;">
        <i class="bi bi-shield-check text-success fs-1 d-block mb-2"></i>
        <h5 class="fw-bold text-dark">Invoice Record Initialized Successfully</h5>
        <p class="text-muted mb-3">Order Log Token: <span class="badge bg-dark font-monospace">${refId}</span></p>
        
        <div class="p-3 bg-light border border-warning rounded my-3 text-center">
          <span class="text-muted d-block small mb-2">Scan this secure UPI canvas layout to clear remittance</span>
          <div id="qrcode-canvas" class="d-inline-block p-2 bg-white border mb-2"></div>
          <h4 class="fw-bold font-monospace text-danger mt-1 mb-0">${formatINR(finalAmt)}</h4>
        </div>

        <div class="alert alert-info py-2 text-start font-monospace" style="font-size: 11px;">
          <strong>Post-Payment Tracking Instructions:</strong><br>
          Take a screenshot of the successful transaction statement. Click the link layout below to instantly share your clearance snapshot alongside token <strong>${refId}</strong> via our corporate WhatsApp clearing house channel.
        </div>

        <a href="https://wa.me/919050623210?text=${encodeURIComponent(`Hello JK Enterprises, I have remitted payment for Industrial Order Token: ${refId}. Attached is my clearance transaction statement screenshot.`)}" target="_blank" class="btn btn-success w-100 rounded-0 fw-bold font-monospace mb-2"><i class="bi bi-whatsapp me-2"></i>Submit Settlement Proof (WhatsApp)</a>
        <button id="complete-flow-btn" class="btn btn-sm btn-outline-dark w-100 rounded-0">Acknowledge & Wipe Local System Buffer</button>
      </div>
    `;

    // Initialize the canvas rendering using the globally scoped library instance safely
    try {
      new QRCode(document.getElementById("qrcode-canvas"), {
        text: getUPIString(finalAmt, refId),
        width: 180,
        height: 180,
        correctLevel: QRCode.CorrectLevel.M
      });
    } catch(e) {
      document.getElementById("qrcode-canvas").innerHTML = `<p class="text-danger small p-2">QR Rendering Engine Unavailable. Proceed via manual confirmation portal.</p>`;
    }

    document.getElementById("complete-flow-btn").addEventListener("click", () => {
      app.clearCart();
      location.hash = "#/index";
    });
  };

  const renderSuccessView = (refId) => {
    container.innerHTML = `
      <div class="bg-white p-5 rounded border shadow-sm text-center mx-auto" style="max-width: 500px;">
        <i class="bi bi-truck-flatbed text-warning display-3 d-block mb-3"></i>
        <h4 class="fw-bold text-dark">Logistics Allocation Order Locked Successfully</h4>
        <p class="text-muted small mb-4">Your commercial freight order has been verified and registered. Reference ID Token: <strong class="text-dark font-monospace bg-light p-1 border rounded">${refId}</strong></p>
        <button id="final-clear-btn" class="btn btn-warning rounded-0 fw-bold px-4 font-monospace small">Clear Buffer & Return to Main Hub</button>
      </div>
    `;
    document.getElementById("final-clear-btn").addEventListener("click", () => {
      app.clearCart();
      location.hash = "#/index";
    });
  };

  renderForm();
}