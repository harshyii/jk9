// ==========================================================
// Checkout
// ==========================================================

import {
    app,
    api,
    formatINR,
    CONFIG
} from "./core.js";

export async function render(container) {

    const cart = app.getCart();

    // ======================================================
    // Empty Cart
    // ======================================================

    if (!cart.length) {

        container.innerHTML = `

<div class="text-center py-5">

    <i class="bi bi-cart-x display-2 text-muted"></i>

    <h2 class="mt-3">

        Your Cart is Empty

    </h2>

    <p class="text-muted">

        Add some products before proceeding to checkout.

    </p>

    <a
        href="products.html"
        class="btn btn-warning">

        Continue Shopping

    </a>

</div>

`;

        return;

    }

    // ======================================================
    // Totals
    // ======================================================

    let subtotal = cart.reduce(

        (total, item) =>

            total + (item.price * item.qty),

        0

    );

    let codCharge = 0;

    let total = subtotal;

    // ======================================================
    // Order Items
    // ======================================================

    const items = cart.map(item => renderItem(item)).join("");

    // ======================================================
    // Layout
    // ======================================================

    container.innerHTML = `

<div class="row g-4">

    <div class="col-lg-7">

        <div class="card shadow-sm">

            <div class="card-body p-4">

                <h2 class="mb-4">

                    Checkout

                </h2>

                <form id="checkout-form">

                    <div class="mb-3">

                        <label class="form-label">

                            Full Name

                        </label>

                        <input
                            id="cust-name"
                            class="form-control"
                            required>

                    </div>

                    <div class="mb-3">

                        <label class="form-label">

                            Mobile Number

                        </label>

                        <input
                            id="cust-phone"
                            class="form-control"
                            maxlength="11"
                            inputmode="numeric"
                            placeholder="9876543210"
                            required>

                    </div>

                    <div class="mb-3">

                        <label class="form-label">

                            Delivery Address

                        </label>

                        <textarea
                            id="cust-address"
                            rows="4"
                            class="form-control"
                            required></textarea>

                    </div>

                    <div class="mb-4">

                        <label class="form-label">

                            Payment Method

                        </label>

                        <select
                            id="payment-method"
                            class="form-select">

                            <option value="UPI">

                                UPI Payment

                            </option>

                            <option value="COD">

                                Cash on Delivery (+5%)

                            </option>

                        </select>

                    </div>

                    <button
                        id="submit-order-btn"
                        class="btn btn-warning w-100">

                        Place Order

                    </button>

                </form>

            </div>

        </div>

    </div>

    <div class="col-lg-5">

        <div
            class="card shadow-sm position-sticky"
            style="top:20px;">

            <div class="card-body">

                <h4 class="mb-3">

                    Order Summary

                </h4>

                ${items}

                <div class="d-flex justify-content-between mt-3">

                    <span>

                        Subtotal

                    </span>

                    <strong id="subtotal-price">

                        ${formatINR(subtotal)}

                    </strong>

                </div>

                <div class="d-flex justify-content-between mt-2">

                    <span>

                        Delivery

                    </span>

                    <span class="text-success">

                        Free

                    </span>

                </div>

                <div class="d-flex justify-content-between mt-2">

                    <span>

                        COD Charge

                    </span>

                    <strong id="cod-price">

                        ${formatINR(codCharge)}

                    </strong>

                </div>

                <hr>

                <div class="d-flex justify-content-between">

                    <h4>

                        Total

                    </h4>

                    <h4
                        id="total-price"
                        class="text-danger">

                        ${formatINR(total)}

                    </h4>

                </div>

                <hr>

                <div id="upi-box">

                    <h5 class="text-center mb-3">

                        Scan & Pay

                    </h5>

                    <div
                        id="upi-qr"
                        class="d-flex justify-content-center mb-3">

                    </div>

                    <div class="text-center">

                        <div class="fs-4 fw-bold text-danger">

                            ${formatINR(total)}

                        </div>

                        <small class="text-muted">

                            UPI ID<br>

                            ${CONFIG.UPI}

                        </small>

                    </div>

                    <a
                        id="upi-pay-btn"
                        class="btn btn-success w-100 mt-3">

                        Pay with UPI App

                    </a>

                </div>

            </div>

        </div>

    </div>

</div>

`;

    initCheckout({

        cart,
        subtotal,
        total,
        codCharge

    });

}
// ======================================================
// Order Item
// ======================================================

function renderItem(item) {

    return `

<div class="d-flex justify-content-between align-items-start py-3 border-bottom">

    <div class="pe-3">

        <div class="fw-semibold">

            ${item.name}

        </div>

        <small class="text-muted">

            ${item.qty} × ${formatINR(item.price)}

        </small>

    </div>

    <div class="fw-bold text-end">

        ${formatINR(item.price * item.qty)}

    </div>

</div>

`;

}
// ======================================================
// Checkout Events
// ======================================================

function initCheckout({

    cart,
    subtotal,
    total,
    codCharge

}) {

    const phone =
        document.getElementById("cust-phone");

    const payment =
        document.getElementById("payment-method");

    const totalBox =
        document.getElementById("total-price");

    const codBox =
        document.getElementById("cod-price");

    const qrBox =
        document.getElementById("upi-box");

    const qr =
        document.getElementById("upi-qr");

    const upiButton =
        document.getElementById("upi-pay-btn");

    // ==================================================
    // Phone Validation
    // ==================================================

    phone.addEventListener("input", () => {

        phone.value = phone.value

            .replace(/\D/g, "")
            .slice(0, 11);

    });

    // ==================================================
    // UPI Link
    // ==================================================

    function updateUPILink() {

        upiButton.href =

            `upi://pay?pa=${CONFIG.UPI}` +
            `&pn=${encodeURIComponent(CONFIG.NAME)}` +
            `&tn=${encodeURIComponent("Order Payment")}` +
            `&am=${total.toFixed(2)}` +
            `&cu=INR`;

    }

    // ==================================================
    // QR Code
    // ==================================================

    function drawQR() {

        if (typeof QRCode !== "function") {

            qr.innerHTML = `

<div class="alert alert-warning mb-0">

    QR Library not loaded.

</div>

`;

            return;

        }

        qr.innerHTML = "";

        new QRCode(qr, {

            text:

                `upi://pay?pa=${CONFIG.UPI}` +
                `&pn=${encodeURIComponent(CONFIG.NAME)}` +
                `&tn=${encodeURIComponent("Order Payment")}` +
                `&am=${total.toFixed(2)}` +
                `&cu=INR`,

            width: 220,

            height: 220

        });

    }

    updateUPILink();

    drawQR();

    if (!/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {

        upiButton.style.display = "none";

    }

    // ==================================================
    // Payment Change
    // ==================================================

    payment.addEventListener("change", () => {

        codCharge =

            payment.value === "COD"

                ? Math.round(subtotal * 0.05)

                : 0;

        total = subtotal + codCharge;

        codBox.textContent =
            formatINR(codCharge);

        totalBox.textContent =
            formatINR(total);

        qrBox.style.display =

            payment.value === "UPI"

                ? "block"

                : "none";

        updateUPILink();

        if (payment.value === "UPI") {

            drawQR();

        }

    });

        // ==================================================
    // Submit Order
    // ==================================================

    document
        .getElementById("checkout-form")
        .addEventListener("submit", submitOrder);

    async function submitOrder(event) {

        event.preventDefault();

        const phoneNumber =
            phone.value.trim();

        const validPhone =

            (
                phoneNumber.length === 10 &&
                /^[1-9]\d{9}$/.test(phoneNumber)
            ) ||

            (
                phoneNumber.length === 11 &&
                /^0\d{10}$/.test(phoneNumber)
            );

        if (!validPhone) {

            alert(

`Enter a valid mobile number.

Examples:

9876543210
09876543210`

            );

            phone.focus();

            return;

        }

        const button =
            document.getElementById(
                "submit-order-btn"
            );

        button.disabled = true;

        button.innerHTML = `

<span class="spinner-border spinner-border-sm me-2"></span>

Placing Order...

`;

        try {

            const order = {

                customerName:

                    document
                        .getElementById("cust-name")
                        .value
                        .trim(),

                phone:

                    phoneNumber,

                address:

                    document
                        .getElementById("cust-address")
                        .value
                        .trim(),

                paymentMethod:

                    payment.value,

                subtotal,

                codCharge,

                total,

                items:

                    cart.map(item => ({

                        sku:

                            item.sku ||
                            item.sku,

                        name:

                            item.name,

                        qty:

                            item.qty,

                        price:

                            item.price

                    }))

            };

            const params =
                new URLSearchParams({

                    action: "order",

                    customerName:
                        order.customerName,

                    phone:
                        order.phone,

                    address:
                        order.address,

                    paymentMethod:
                        order.paymentMethod,

                    subtotal:
                        order.subtotal,

                    codCharge:
                        order.codCharge,

                    total:
                        order.total,

                    items:
                        JSON.stringify(order.items)

                });

            const response = await fetch(

                `${CONFIG.API}?${params}`

            );

            if (!response.ok) {

                throw new Error(

                    `HTTP ${response.status}`

                );

            }

            const data =
                await response.json();

            if (!data.success) {

                throw new Error(

                    data.error ||
                    "Order could not be saved."

                );

            }

            let message =
                `*New Order : ${data.orderId}*\n\n`;

            cart.forEach((item, index) => {

                message +=

`${index + 1}. ${item.name}
Qty : ${item.qty}
Amount : ${formatINR(item.qty * item.price)}

`;

            });

            message +=

`Total : ${formatINR(total)}

Payment : ${payment.value}

Customer : ${order.customerName}

Phone : ${order.phone}

Address : ${order.address}`;

            app.clearCart();

            window.location.href =

                `https://wa.me/${CONFIG.WHATSAPP}?text=${encodeURIComponent(message)}`;

        }

        catch (error) {

            console.error(error);

            alert(

                error.message ||
                "Unable to place order."

            );

            button.disabled = false;

            button.textContent =
                "Place Order";

        }

    }

}