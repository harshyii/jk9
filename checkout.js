// ==========================================================
// Checkout
// ==========================================================

import { app, api, formatINR, CONFIG } from "./core.js";

export async function render(container){

const cart=app.getCart();

if(!cart.length){

container.innerHTML=`
<div class="text-center py-5">

<i class="bi bi-cart-x display-1 text-muted"></i>

<h3 class="mt-3">
Your cart is empty
</h3>

<p class="text-muted">
Add some products before proceeding to checkout.
</p>

<a
href="#/products"
class="btn btn-warning fw-semibold">
Continue Shopping
</a>

</div>
`;

return;

}

let subtotal=cart.reduce((t,i)=>t+i.price*i.qty,0);
let codCharge=0;
let total=subtotal;

const items=cart.map(i=>`

<div class="d-flex justify-content-between border-bottom py-2">

<div>

<div class="fw-semibold">
${i.name}
</div>

<small class="text-muted">
${i.qty} × ${formatINR(i.price)}
</small>

</div>

<div class="fw-semibold">
${formatINR(i.price*i.qty)}
</div>

</div>

`).join("");

container.innerHTML=`

<div class="row g-4">

<div class="col-lg-7">

<div class="card shadow-sm">

<div class="card-body p-4">

<h3 class="mb-4">
Checkout
</h3>

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
class="btn btn-warning w-100 fw-semibold">

Place Order

</button>

</form>

</div>

</div>

</div>

<div class="col-lg-5">

<div class="card shadow-sm position-sticky" style="top:20px;">

<div class="card-body">

<h4 class="mb-3">
Order Summary
</h4>

${items}

<div class="d-flex justify-content-between mt-3">

<span>
Subtotal
</span>

<span id="subtotal-price">
${formatINR(subtotal)}
</span>

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

<span id="cod-price">
${formatINR(codCharge)}
</span>

</div>

<hr>

<div class="d-flex justify-content-between fw-bold fs-4">

<span>
Total
</span>

<span
id="total-price"
class="text-danger">

${formatINR(total)}

</span>

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

<div class="fw-bold fs-4 text-danger">
${formatINR(total)}
</div>

<small class="text-muted">
UPI ID<br>
${CONFIG.UPI}
</small>

</div>

<a
id="upi-pay-btn"
class="btn btn-success w-100 mt-3 fw-semibold">
Pay with UPI App
</a>

</div>

</div>

</div>

</div>

</div>

`;

const payment=document.getElementById("payment-method");
const totalBox=document.getElementById("total-price");
const codBox=document.getElementById("cod-price");
const qrBox=document.getElementById("upi-box");
const qr=document.getElementById("upi-qr");

function drawQR(){

qr.innerHTML="";

new QRCode(qr,{
text:
`upi://pay?pa=${CONFIG.UPI}`+
`&pn=${encodeURIComponent(CONFIG.NAME)}`+
`&tn=${encodeURIComponent("Order Payment")}`+
`&am=${total.toFixed(2)}`+
`&cu=INR`,
width:220,
height:220
});

}

if(typeof QRCode==="function"){
drawQR();
const upiBtn=document.getElementById("upi-pay-btn");

function updateUPILink(){

upiBtn.href=
`upi://pay?pa=${CONFIG.UPI}`+
`&pn=${encodeURIComponent(CONFIG.NAME)}`+
`&tn=${encodeURIComponent("Order Payment")}`+
`&am=${total.toFixed(2)}`+
`&cu=INR`;

}

updateUPILink();
if(!/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)){
upiBtn.style.display="none";
}
}else{
qr.innerHTML=`
<div class="alert alert-warning mb-0">
QR Library not loaded.
</div>`;
}

payment.onchange=()=>{

if(payment.value==="COD"){

codCharge=Math.round(subtotal*0.05);
qrBox.style.display="none";

}else{

codCharge=0;
qrBox.style.display="block";

}

total=subtotal+codCharge;

codBox.innerHTML=formatINR(codCharge);
totalBox.innerHTML=formatINR(total);

updateUPILink();

if(payment.value==="UPI")drawQR();

};

document.getElementById("checkout-form").onsubmit=async e=>{

e.preventDefault();

const btn=document.getElementById("submit-order-btn");

btn.disabled=true;

btn.innerHTML=`
<span class="spinner-border spinner-border-sm me-2"></span>
Placing Order...
`;

const order={

customerName:document.getElementById("cust-name").value.trim(),
phone:document.getElementById("cust-phone").value.trim(),
address:document.getElementById("cust-address").value.trim(),
paymentMethod:payment.value,
subtotal,
codCharge,
total,

items:cart.map(i=>({
sku:i.sku,
name:i.name,
qty:i.qty,
price:i.price
}))

};

const res=await api.post("order",order);

const orderId=res.success
?res.orderId
:"JKE-"+Date.now();

let msg=`*New Order : ${orderId}*\n\n`;

cart.forEach((i,n)=>{
msg+=`${n+1}. ${i.name}\n`;
msg+=`Qty : ${i.qty}\n`;
msg+=`Amount : ${formatINR(i.price*i.qty)}\n\n`;
});

msg+=`Total : ${formatINR(total)}\n`;
msg+=`Payment : ${payment.value}\n\n`;

msg+=`Customer : ${order.customerName}\n`;
msg+=`Phone : ${order.phone}\n`;
msg+=`Address : ${order.address}`;

app.clearCart();

window.location.href=
`https://wa.me/${CONFIG.WHATSAPP}?text=${encodeURIComponent(msg)}`;

};}