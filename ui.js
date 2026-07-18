// ==========================================================
// Central UI View Router Broker Matrix
// ==========================================================
import { $ } from "./core.js";
import { getHeaderHTML, getFooterHTML, initHeaderEvents } from "./layout.js";

// ==========================================================
// Static Pages
// ==========================================================

const STATIC_PAGES  = {

about: `
<div class="bg-white rounded shadow-sm p-4 p-lg-5">

<div class="text-center mb-5">

<h1 class="fw-bold mb-3">
About HARYANA TOOLS
</h1>

<p class="lead text-muted mb-0">
Trusted Wholesale & Retail Supplier of Industrial Tools, Power Tools, Solar Products and Automotive Care Products in India.
</p>

</div>

<div class="row g-5 align-items-center mb-5">

<div class="col-lg-7">

<h3 class="fw-bold mb-3">
Who We Are
</h3>

<p>
HARYANA TOOLS is an Indian supplier of quality industrial products, power tools,
hand tools, solar products, automotive care products and workshop equipment.
We serve retailers, workshops, contractors, institutions, businesses and individual
customers with reliable products sourced from trusted manufacturers.
</p>

<p>
Our focus is simple — provide genuine products, competitive pricing, fast order
processing and dependable customer support. Whether you need a single item or
bulk quantities, we aim to make purchasing easy and transparent.
</p>

</div>

<div class="col-lg-5">

<div class="card border-0 bg-light">

<div class="card-body">

<h5 class="fw-bold mb-3">
Why Choose HARYANA TOOLS?
</h5>

<ul class="mb-0">

<li>✔ Genuine products from trusted brands</li>

<li>✔ Competitive wholesale & retail pricing</li>

<li>✔ Fast order processing</li>

<li>✔ Secure payment options</li>

<li>✔ Customer support before and after purchase</li>

<li>✔ Delivery across India</li>

</ul>

</div>

</div>

</div>

</div>

<div class="row g-4 mb-5">

<div class="col-md-6">

<div class="card h-100 shadow-sm">

<div class="card-body">

<h4 class="fw-bold mb-3">
Our Products
</h4>

<p>
We continuously expand our catalogue to meet the needs of professionals,
businesses and individual customers.
</p>

<ul class="mb-0">

<li>Power Tools</li>

<li>Hand Tools</li>

<li>Solar Products</li>

<li>Automotive Care Products</li>

<li>Industrial Equipment</li>

<li>Workshop Accessories</li>

<li>Safety Products</li>

<li>Electrical Accessories</li>

</ul>

</div>

</div>

</div>

<div class="col-md-6">

<div class="card h-100 shadow-sm">

<div class="card-body">

<h4 class="fw-bold mb-3">
Our Commitment
</h4>

<p>
Customer satisfaction is our highest priority. We believe in honest pricing,
quality products and long-term business relationships.
</p>

<p>
Every order is handled with care, and we continuously improve our product
selection and services to meet changing customer requirements.
</p>

</div>

</div>

</div>

</div>

<div class="bg-light rounded p-4 mb-5">

<h3 class="fw-bold mb-3">
Serving Customers Across India
</h3>

<p class="mb-0">
We proudly supply products to customers across India through reliable courier
and logistics partners. From small businesses to large industrial buyers, we
strive to deliver quality products with dependable service and timely support.
</p>

</div>

<div class="row g-4 mb-5">

<div class="col-md-4">

<div class="text-center">

<div class="display-6 fw-bold text-warning">
1000+
</div>

<h6 class="fw-bold">
Products
</h6>

<p class="text-muted mb-0">
Growing catalogue across multiple categories.
</p>

</div>

</div>

<div class="col-md-4">

<div class="text-center">

<div class="display-6 fw-bold text-warning">
India
</div>

<h6 class="fw-bold">
Nationwide Delivery
</h6>

<p class="text-muted mb-0">
Shipping available to serviceable locations across India.
</p>

</div>

</div>

<div class="col-md-4">

<div class="text-center">

<div class="display-6 fw-bold text-warning">
B2B & B2C
</div>

<h6 class="fw-bold">
Business & Retail
</h6>

<p class="text-muted mb-0">
Serving wholesalers, businesses and individual customers.
</p>

</div>

</div>

</div>

<hr class="my-5">

<div class="text-center">

<h3 class="fw-bold mb-3">
Thank You for Choosing HARYANA TOOLS
</h3>

<p class="text-muted mb-4">
We appreciate your trust and look forward to serving you with quality products,
competitive pricing and reliable customer support.
</p>

<a href="products.html" class="btn btn-warning btn-lg px-4">
Browse Products
</a>

</div>

</div>
`,

contact: `
<div class="bg-white rounded shadow-sm p-4 p-lg-5">

<div class="text-center mb-5">

<h1 class="fw-bold mb-3">
Contact HARYANA TOOLS <h3> <b> by JK ENTERPRISES</b></h3>
</h1>

<p class="lead text-muted mb-0">
We're here to help with product enquiries, bulk orders, quotations, order support and after-sales assistance.
</p>

</div>

<div class="row g-4 mb-5">

<div class="col-lg-7">

<h3 class="fw-bold mb-4">
Get in Touch
</h3>

<p>
Whether you're looking for industrial tools, power tools, solar products,
automotive care products or wholesale pricing, our team is ready to assist.
We aim to respond to all customer enquiries as quickly as possible.
</p>

<div class="row g-3 mt-3">

<div class="col-md-6">

<div class="card h-100 border-0 bg-light">

<div class="card-body">

<h6 class="fw-bold mb-3">
<i class="bi bi-telephone-fill text-warning me-2"></i>
Phone
</h6>

<p class="mb-1">
<a href="tel:+919050623210" class="text-decoration-none">
+91 90506 23210
</a>
</p>

<small class="text-muted">
Call during business hours.
</small>

</div>

</div>

</div>

<div class="col-md-6">

<div class="card h-100 border-0 bg-light">

<div class="card-body">

<h6 class="fw-bold mb-3">
<i class="bi bi-envelope-fill text-warning me-2"></i>
Email
</h6>

<p class="mb-1">
<a href="mailto:care@haryana.tools" class="text-decoration-none">
care@haryana.tools
</a>
</p>

<small class="text-muted">
We'll reply as soon as possible.
</small>

</div>

</div>

</div>

<div class="col-md-6">

<div class="card h-100 border-0 bg-light">

<div class="card-body">

<h6 class="fw-bold mb-3">
<i class="bi bi-clock-fill text-warning me-2"></i>
Business Hours
</h6>

<p class="mb-1">
Monday - Saturday
</p>

<p class="mb-0">
9:00 AM - 6:00 PM (IST)
</p>

</div>

</div>

</div>

<div class="col-md-6">

<div class="card h-100 border-0 bg-light">

<div class="card-body">

<h6 class="fw-bold mb-3">
<i class="bi bi-truck text-warning me-2"></i>
Delivery
</h6>

<p class="mb-0">
Shipping available across serviceable locations throughout India.
</p>

</div>

</div>

</div>

</div>

</div>

<div class="col-lg-5">

<div class="card shadow-sm border-0">

<div class="card-body">

<h4 class="fw-bold mb-4">
Business Information
</h4>

<table class="table table-sm mb-0">

<tr>
<th>Business</th>
<td>JK ENTERPRISES</td>
</tr>

<tr>
<th>Website</th>
<td>haryana.tools</td>
</tr>

<tr>
<th>Support</th>
<td>care@haryana.tools</td>
</tr>

<tr>
<th>Phone</th>
<td>+91 90506 23210</td>
</tr>

<tr>
<th>Market</th>
<td>India</td>
</tr>

<tr>
<th>Services</th>
<td>Retail & Wholesale Supply</td>
</tr>

</table>

</div>

</div>

</div>

</div>

<div class="bg-light rounded p-4 my-5">

<h3 class="fw-bold mb-3">
How Can We Help?
</h3>

<div class="row">

<div class="col-md-6">

<ul class="mb-0">

<li>Product enquiries</li>

<li>Bulk & wholesale pricing</li>

<li>Quotation requests</li>

<li>Order status updates</li>

</ul>

</div>

<div class="col-md-6">

<ul class="mb-0">

<li>Warranty assistance</li>

<li>Returns & refunds</li>

<li>Delivery information</li>

<li>General customer support</li>

</ul>

</div>

</div>

</div>

<div class="text-center mt-5">

<h3 class="fw-bold mb-3">
We're Happy to Assist You
</h3>

<p class="text-muted mb-4">
Our team is committed to providing reliable service, genuine products and timely customer support. Feel free to contact us for any questions before or after placing your order.
</p>

<a href="tel:+919050623210" class="btn btn-warning btn-lg me-2">
<i class="bi bi-telephone-fill me-2"></i>
Call Now
</a>

<a href="mailto:care@haryana.tools" class="btn btn-outline-dark btn-lg">
<i class="bi bi-envelope-fill me-2"></i>
Email Us
</a>

</div>

</div>
`,

terms: `
<div class="bg-white rounded shadow-sm p-4 p-lg-5">

<div class="text-center mb-5">

<h1 class="fw-bold mb-3">
Terms & Conditions
</h1>

<p class="lead text-muted mb-0">
Please read these Terms & Conditions carefully before using our website or placing an order with HARYANA TOOLS.
</p>

</div>

<div class="mb-5">

<h3 class="fw-bold mb-3">
1. Acceptance of Terms
</h3>

<p>
By accessing this website or placing an order, you agree to comply with these Terms & Conditions. If you do not agree with any part of these terms, please do not use this website.
</p>

</div>

<div class="mb-5">

<h3 class="fw-bold mb-3">
2. Products & Pricing
</h3>

<ul>

<li>All prices displayed on this website are in Indian Rupees (INR).</li>

<li>Prices may change without prior notice.</li>

<li>Product images are for illustration purposes only.</li>

<li>Specifications, colours and packaging may vary depending on the manufacturer.</li>

<li>We make every effort to ensure product information is accurate, however errors may occasionally occur.</li>

</ul>

</div>

<div class="mb-5">

<h3 class="fw-bold mb-3">
3. Orders
</h3>

<ul>

<li>Orders are subject to product availability.</li>

<li>We reserve the right to accept, decline or cancel any order.</li>

<li>Customers must provide accurate billing, shipping and contact information.</li>

<li>Incorrect information may delay order processing or delivery.</li>

</ul>

</div>

<div class="mb-5">

<h3 class="fw-bold mb-3">
4. Payments
</h3>

<ul>

<li>Payments must be completed using the payment methods available during checkout.</li>

<li>Cash on Delivery (if available) is subject to serviceability and order value.</li>

<li>Orders may be cancelled if payment cannot be verified.</li>

</ul>

</div>

<div class="mb-5">

<h3 class="fw-bold mb-3">
5. Shipping & Delivery
</h3>

<ul>

<li>Delivery timelines are estimates and may vary depending on location.</li>

<li>Delivery delays caused by courier companies, weather conditions or public holidays are beyond our control.</li>

<li>Customers should inspect the package before accepting delivery.</li>

</ul>

</div>

<div class="mb-5">

<h3 class="fw-bold mb-3">
6. Warranty
</h3>

<p>

Products carrying a manufacturer's warranty are covered only by the respective manufacturer's warranty policy. HARYANA TOOLS assists customers wherever possible but does not provide additional warranties unless specifically mentioned.

</p>

</div>

<div class="mb-5">

<h3 class="fw-bold mb-3">
7. Returns & Refunds
</h3>

<p>

Returns and refunds are governed by our Return & Refund Policy. Customers are requested to review that policy before placing an order.

</p>

</div>

<div class="mb-5">

<h3 class="fw-bold mb-3">
8. Intellectual Property
</h3>

<p>

All content on this website including text, logos, graphics, images and design elements belongs to HARYANA TOOLS or their respective owners and may not be copied, reproduced or distributed without permission.

</p>

</div>

<div class="mb-5">

<h3 class="fw-bold mb-3">
9. Limitation of Liability
</h3>

<p>

HARYANA TOOLS shall not be liable for any indirect, incidental or consequential damages arising from the use of this website or the products sold through it, except where required by applicable law.

</p>

</div>

<div class="mb-5">

<h3 class="fw-bold mb-3">
10. Governing Law
</h3>

<p>

These Terms & Conditions shall be governed by the laws of India. Any disputes shall be subject to the jurisdiction of the appropriate courts in India.

</p>

</div>

<div class="alert alert-warning border-0">

<h5 class="fw-bold mb-2">
Important Notice
</h5>

<p class="mb-0">

By placing an order on this website, you confirm that you have read, understood and agreed to these Terms & Conditions as well as our Privacy Policy, Shipping Policy and Return & Refund Policy.

</p>

</div>

</div>
`,

privacy: `
<div class="bg-white rounded shadow-sm p-4 p-lg-5">

<div class="text-center mb-5">

<h1 class="fw-bold mb-3">
Privacy Policy
</h1>

<p class="lead text-muted mb-0">
Your privacy is important to us. This Privacy Policy explains how HARYANA TOOLS collects, uses, stores and protects your personal information when you visit our website or place an order.
</p>

</div>

<div class="mb-5">

<h3 class="fw-bold mb-3">
1. Information We Collect
</h3>

<p>
We may collect the following information when you browse our website or place an order:
</p>

<ul>

<li>Name</li>

<li>Mobile Number</li>

<li>Email Address</li>

<li>Shipping & Billing Address</li>

<li>Order Details</li>

<li>Payment Method</li>

<li>Device and Browser Information</li>

<li>IP Address (where applicable)</li>

</ul>

</div>

<div class="mb-5">

<h3 class="fw-bold mb-3">
2. How We Use Your Information
</h3>

<p>
The information collected is used only for legitimate business purposes including:
</p>

<ul>

<li>Processing and delivering your orders.</li>

<li>Providing customer support.</li>

<li>Responding to enquiries.</li>

<li>Sending order confirmations and updates.</li>

<li>Improving our products and services.</li>

<li>Preventing fraud and ensuring website security.</li>

<li>Complying with legal and regulatory requirements.</li>

</ul>

</div>

<div class="mb-5">

<h3 class="fw-bold mb-3">
3. Payment Information
</h3>

<p>
Payments are processed through trusted payment providers. HARYANA TOOLS does not store your complete debit card, credit card or banking credentials on this website.
</p>

</div>

<div class="mb-5">

<h3 class="fw-bold mb-3">
4. Cookies
</h3>

<p>
Our website may use cookies and similar technologies to improve your browsing experience, remember preferences and analyse website traffic.
</p>

<ul>

<li>Remember shopping preferences.</li>

<li>Improve website performance.</li>

<li>Measure visitor activity.</li>

<li>Provide a better shopping experience.</li>

</ul>

</div>

<div class="mb-5">

<h3 class="fw-bold mb-3">
5. Analytics & Advertising
</h3>

<p>
We may use services such as Google Analytics, Google Search Console and other analytics tools to understand website performance and improve user experience.
</p>

<p>
If advertisements are displayed, advertising partners may use cookies in accordance with their own privacy policies.
</p>

</div>

<div class="mb-5">

<h3 class="fw-bold mb-3">
6. Information Sharing
</h3>

<p>
We respect your privacy and do not sell or rent your personal information.
</p>

<p>
Information may be shared only when necessary with:
</p>

<ul>

<li>Courier and logistics partners.</li>

<li>Payment service providers.</li>

<li>Government authorities where legally required.</li>

<li>Technology providers supporting our website.</li>

</ul>

</div>

<div class="mb-5">

<h3 class="fw-bold mb-3">
7. Data Security
</h3>

<p>
We take reasonable technical and organisational measures to protect customer information from unauthorised access, misuse or disclosure.
</p>

<p>
Although we strive to protect your data, no method of transmission over the internet is completely secure.
</p>

</div>

<div class="mb-5">

<h3 class="fw-bold mb-3">
8. Your Rights
</h3>

<p>
You may contact us to:
</p>

<ul>

<li>Request correction of your information.</li>

<li>Update your contact details.</li>

<li>Request deletion of your information where legally permitted.</li>

<li>Ask questions regarding this Privacy Policy.</li>

</ul>

</div>

<div class="mb-5">

<h3 class="fw-bold mb-3">
9. Children's Privacy
</h3>

<p>
Our website is intended for general audiences and is not directed towards children under the age of 18. We do not knowingly collect personal information from children.
</p>

</div>

<div class="mb-5">

<h3 class="fw-bold mb-3">
10. Policy Updates
</h3>

<p>
We may update this Privacy Policy from time to time to reflect changes in our business, legal requirements or website functionality. The updated version will be published on this page.
</p>

</div>

<div class="alert alert-light border">

<h5 class="fw-bold mb-3">
Contact Us
</h5>

<p class="mb-2">
If you have any questions regarding this Privacy Policy or your personal information, please contact us:
</p>

<ul class="list-unstyled mb-0">

<li><strong>HARYANA TOOLS</strong></li>

<li>📧 care@haryana.tools</li>

<li>📞 +91 90506 23210</li>

<li>🌐 https://www.haryana.tools</li>

</ul>

</div>

</div>
`,

shipping: `
<div class="bg-white rounded shadow-sm p-4 p-lg-5">

<div class="text-center mb-5">

<h1 class="fw-bold mb-3">
Shipping Policy
</h1>

<p class="lead text-muted mb-0">
HARYANA TOOLS is committed to delivering your orders safely and on time. Please read our shipping policy to understand how we process and deliver orders across India.
</p>

</div>

<div class="mb-5">

<h3 class="fw-bold mb-3">
1. Order Processing
</h3>

<p>
Orders are processed after successful payment confirmation or order verification in the case of Cash on Delivery (if available).
</p>

<ul>

<li>Processing Time: <strong>1–3 Business Days</strong></li>

<li>Orders placed on Sundays or public holidays are processed on the next working day.</li>

<li>Bulk or special orders may require additional processing time.</li>

</ul>

</div>

<div class="mb-5">

<h3 class="fw-bold mb-3">
2. Delivery Coverage
</h3>

<p>
We deliver to most serviceable locations across India through trusted courier and logistics partners.
</p>

<ul>

<li>Metro Cities</li>

<li>Tier 2 & Tier 3 Cities</li>

<li>Towns & Rural Areas (where courier services are available)</li>

</ul>

</div>

<div class="mb-5">

<h3 class="fw-bold mb-3">
3. Estimated Delivery Time
</h3>

<div class="table-responsive">

<table class="table table-bordered align-middle">

<thead class="table-light">

<tr>

<th>Location</th>

<th>Estimated Delivery</th>

</tr>

</thead>

<tbody>

<tr>

<td>Metro Cities</td>

<td>2–5 Business Days</td>

</tr>

<tr>

<td>Other Cities</td>

<td>3–7 Business Days</td>

</tr>

<tr>

<td>Remote Areas</td>

<td>5–10 Business Days</td>

</tr>

</tbody>

</table>

</div>

<p class="small text-muted mb-0">
Delivery timelines are estimates and may vary depending on courier operations and local conditions.
</p>

</div>

<div class="mb-5">

<h3 class="fw-bold mb-3">
4. Shipping Charges
</h3>

<p>
Shipping charges, if applicable, are calculated during checkout based on the delivery location, order value and product weight.
</p>

<ul>

<li>Free shipping may be offered on selected products or promotional campaigns.</li>

<li>Heavy or oversized products may incur additional freight charges.</li>

</ul>

</div>

<div class="mb-5">

<h3 class="fw-bold mb-3">
5. Order Tracking
</h3>

<p>
Once your order has been dispatched, you will receive shipment details and tracking information (where available) through the contact details provided during checkout.
</p>

</div>

<div class="mb-5">

<h3 class="fw-bold mb-3">
6. Delivery Attempts
</h3>

<ul>

<li>Please ensure someone is available to receive the package.</li>

<li>Courier partners may attempt delivery more than once depending on their policy.</li>

<li>If delivery is unsuccessful due to an incorrect address or customer unavailability, additional shipping charges may apply for re-dispatch.</li>

</ul>

</div>

<div class="mb-5">

<h3 class="fw-bold mb-3">
7. Damaged or Missing Shipments
</h3>

<p>
If you receive a damaged package or if any item is missing, please contact us as soon as possible with your order details and supporting photographs (if applicable).
</p>

<ul>

<li>Report damaged deliveries within 48 hours of receipt.</li>

<li>Keep the original packaging until the issue is resolved.</li>

</ul>

</div>

<div class="mb-5">

<h3 class="fw-bold mb-3">
8. Delivery Delays
</h3>

<p>
While we strive to deliver every order on time, delays may occur due to circumstances beyond our control, including:
</p>

<ul>

<li>Natural disasters</li>

<li>Extreme weather conditions</li>

<li>Government restrictions</li>

<li>Transport disruptions</li>

<li>Courier operational issues</li>

<li>Public holidays and festivals</li>

</ul>

</div>

<div class="mb-5">

<h3 class="fw-bold mb-3">
9. Customer Responsibilities
</h3>

<ul>

<li>Provide accurate delivery information.</li>

<li>Ensure the mobile number is reachable during delivery.</li>

<li>Inspect the package before accepting delivery whenever possible.</li>

<li>Notify us immediately if there is any issue with the shipment.</li>

</ul>

</div>

<div class="alert alert-light border">

<h5 class="fw-bold mb-3">
Need Shipping Assistance?
</h5>

<p class="mb-2">
If you have any questions regarding shipping, delivery timelines or order tracking, please contact our support team.
</p>

<ul class="list-unstyled mb-0">

<li><strong>HARYANA TOOLS</strong></li>

<li>📞 +91 90506 23210</li>

<li>📧 care@haryana.tools</li>

<li>🌐 https://www.haryana.tools</li>

</ul>

</div>

</div>
`,

returns: `
<div class="bg-white rounded shadow-sm p-4 p-lg-5">

<div class="text-center mb-5">

<h1 class="fw-bold mb-3">
Return & Refund Policy
</h1>

<p class="lead text-muted mb-0">
At HARYANA TOOLS, customer satisfaction is important to us. If you receive a damaged, defective or incorrect product, we will do our best to resolve the issue quickly and fairly.
</p>

</div>

<div class="mb-5">

<h3 class="fw-bold mb-3">
1. Return Eligibility
</h3>

<p>
Products may be eligible for return only under the following circumstances:
</p>

<ul>

<li>Incorrect product delivered.</li>

<li>Damaged product received during transit.</li>

<li>Manufacturing defect.</li>

<li>Incomplete shipment or missing items.</li>

</ul>

<p class="mb-0">
Products must be unused, in their original condition and returned with the original packaging, accessories, manuals and invoice wherever applicable.
</p>

</div>

<div class="mb-5">

<h3 class="fw-bold mb-3">
2. Non-Returnable Items
</h3>

<p>
The following products are generally not eligible for return unless they are damaged or defective:
</p>

<ul>

<li>Used products.</li>

<li>Products damaged due to improper handling or misuse.</li>

<li>Consumable items.</li>

<li>Products specially ordered for customers.</li>

<li>Items without original packaging or accessories.</li>

<li>Products returned beyond the eligible return period.</li>

</ul>

</div>

<div class="mb-5">

<h3 class="fw-bold mb-3">
3. Return Request Period
</h3>

<p>
Return requests should be submitted within <strong>7 days</strong> from the date of delivery.
</p>

<p class="mb-0">
Requests received after this period may not qualify for return or refund unless covered by the manufacturer's warranty.
</p>

</div>

<div class="mb-5">

<h3 class="fw-bold mb-3">
4. How to Request a Return
</h3>

<ol>

<li>Contact our customer support.</li>

<li>Provide your Order ID.</li>

<li>Share clear photographs or videos of the issue.</li>

<li>Wait for return approval and instructions.</li>

<li>Pack the product securely for pickup or return shipment.</li>

</ol>

</div>

<div class="mb-5">

<h3 class="fw-bold mb-3">
5. Refund Process
</h3>

<p>
After the returned product is received and inspected, we will notify you regarding the approval status.
</p>

<ul>

<li>Approved refunds are processed to the original payment method whenever possible.</li>

<li>Processing time may vary depending on your bank or payment provider.</li>

<li>Shipping charges may not be refundable unless the return is due to our error.</li>

</ul>

</div>

<div class="mb-5">

<h3 class="fw-bold mb-3">
6. Replacement Policy
</h3>

<p>
Where stock is available, eligible products may be replaced instead of refunded.
</p>

<p class="mb-0">
If the product is unavailable, an appropriate refund or alternative solution will be offered.
</p>

</div>

<div class="mb-5">

<h3 class="fw-bold mb-3">
7. Manufacturer Warranty
</h3>

<p>
Many products sold by HARYANA TOOLS are covered by the respective manufacturer's warranty.
</p>

<p class="mb-0">
Warranty claims are handled according to the manufacturer's warranty terms and service procedures.
</p>

</div>

<div class="mb-5">

<h3 class="fw-bold mb-3">
8. Cancellation Policy
</h3>

<ul>

<li>Orders may be cancelled before dispatch.</li>

<li>Orders already shipped cannot normally be cancelled.</li>

<li>If cancellation is approved after payment, the applicable refund process will be initiated.</li>

</ul>

</div>

<div class="mb-5">

<h3 class="fw-bold mb-3">
9. Important Notes
</h3>

<ul>

<li>Please inspect your package at the time of delivery whenever possible.</li>

<li>Retain the invoice until the return or warranty period has expired.</li>

<li>Do not use damaged products before contacting customer support.</li>

<li>Return approval is subject to verification of the reported issue.</li>

</ul>

</div>

<div class="alert alert-warning border-0">

<h5 class="fw-bold mb-3">
Need Help With a Return?
</h5>

<p class="mb-3">
Our support team will be happy to assist you with returns, replacements, warranty guidance or refund-related questions.
</p>

<div class="row">

<div class="col-md-4">

<strong>Phone</strong><br>
+91 90506 23210

</div>

<div class="col-md-4">

<strong>Email</strong><br>
care@haryana.tools

</div>

<div class="col-md-4">

<strong>Website</strong><br>
haryana.tools

</div>

</div>

</div>

</div>
`,

faq: `
<div class="bg-white rounded shadow-sm p-4 p-lg-5">

<div class="text-center mb-5">

<h1 class="fw-bold mb-3">
Frequently Asked Questions
</h1>

<p class="lead text-muted mb-0">
Find answers to the most commonly asked questions about HARYANA TOOLS, our services, ordering process and customer support.
</p>

</div>

<div class="accordion" id="faqAccordion">

<div class="accordion-item">
<h2 class="accordion-header">
<button class="accordion-button" data-bs-toggle="collapse" data-bs-target="#faq1">
What is HARYANA TOOLS?
</button>
</h2>
<div id="faq1" class="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
<div class="accordion-body">
HARYANA TOOLS is an Indian supplier of industrial tools, power tools, hand tools, solar products, automotive care products and related equipment. We serve both retail and wholesale customers across India.
</div>
</div>
</div>

<div class="accordion-item">
<h2 class="accordion-header">
<button class="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#faq2">
Where is HARYANA TOOLS located?
</button>
</h2>
<div id="faq2" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
<div class="accordion-body">
We operate from India and serve customers across the country through trusted courier and logistics partners.
</div>
</div>
</div>

<div class="accordion-item">
<h2 class="accordion-header">
<button class="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#faq3">
What are your business hours?
</button>
</h2>
<div id="faq3" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
<div class="accordion-body">
Our customer support team is available from <strong>Monday to Saturday, 9:00 AM to 6:00 PM (IST)</strong>. Enquiries received outside business hours are answered on the next working day.
</div>
</div>
</div>

<div class="accordion-item">
<h2 class="accordion-header">
<button class="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#faq4">
How can I contact HARYANA TOOLS?
</button>
</h2>
<div id="faq4" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
<div class="accordion-body">
You can contact us by phone, email or through our Contact Us page. We are happy to assist with enquiries, quotations, wholesale requirements and customer support.
</div>
</div>
</div>

<div class="accordion-item">
<h2 class="accordion-header">
<button class="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#faq5">
Do you offer wholesale pricing?
</button>
</h2>
<div id="faq5" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
<div class="accordion-body">
Yes. We welcome enquiries from retailers, dealers, institutions, contractors and businesses looking to purchase products in bulk. Please contact us for wholesale pricing and quotations.
</div>
</div>
</div>

<div class="accordion-item">
<h2 class="accordion-header">
<button class="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#faq6">
Which locations do you serve?
</button>
</h2>
<div id="faq6" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
<div class="accordion-body">
We serve customers across India. Delivery is available to most serviceable locations through our courier and logistics partners.
</div>
</div>
</div>

<div class="accordion-item">
<h2 class="accordion-header">
<button class="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#faq7">
How quickly do you respond to enquiries?
</button>
</h2>
<div id="faq7" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
<div class="accordion-body">
We aim to respond to most customer enquiries within one business day. Response times may vary during weekends, holidays or periods of high enquiry volume.
</div>
</div>
</div>

<div class="accordion-item">
<h2 class="accordion-header">
<button class="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#faq8">
Can businesses request quotations?
</button>
</h2>
<div id="faq8" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
<div class="accordion-body">
Yes. Businesses, contractors, government organisations and institutions can request quotations for bulk purchases or project requirements.
</div>
</div>
</div>

<div class="accordion-item">
<h2 class="accordion-header">
<button class="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#faq9">
Is my information kept secure?
</button>
</h2>
<div id="faq9" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
<div class="accordion-body">
Yes. Customer information is handled according to our Privacy Policy and is used only for order processing, customer support and other legitimate business purposes.
</div>
</div>
</div>

<div class="accordion-item">
<h2 class="accordion-header">
<button class="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#faq10">
How can I stay updated?
</button>
</h2>
<div id="faq10" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
<div class="accordion-body">
Visit our website regularly to discover new products, special offers, buying guides and business updates published by HARYANA TOOLS.
</div>
</div>
</div>

</div>

<div class="bg-light rounded p-4 mt-5">

<h3 class="fw-bold mb-3">
Still Have Questions?
</h3>

<p class="mb-3">
If you couldn't find the information you were looking for, our team will be happy to assist you.
</p>

<div class="row text-center">

<div class="col-md-4">
<h6 class="fw-bold">Phone</h6>
<p class="mb-0">+91 90506 23210</p>
</div>

<div class="col-md-4">
<h6 class="fw-bold">Email</h6>
<p class="mb-0">care@haryana.tools</p>
</div>

<div class="col-md-4">
<h6 class="fw-bold">Business Hours</h6>
<p class="mb-0">Mon – Sat<br>9:00 AM – 6:00 PM</p>
</div>

</div>

</div>

</div>
`,

};

export async function renderView(viewName, params = {}) {
  const root = $("#app-root");
  if (!root) return;

  // Initialize the baseline structure shell layout
  root.innerHTML = `
    ${getHeaderHTML()}
    <main class="container my-4 min-vh-100" id="main-content">
      <div class="d-flex justify-content-center py-5" id="view-spinner">
        <div class="spinner-border text-warning" role="status"><span class="visually-hidden">Loading...</span></div>
      </div>
    </main>
    ${getFooterHTML()}
  `;
  initHeaderEvents();
  const target = $("#main-content");

  // Handle Static Legal View Documents instantly
  if (STATIC_PAGES[viewName]) {

    target.innerHTML = `
        <div class="bg-white p-4 rounded shadow-sm">
            ${STATIC_PAGES[viewName]}
        </div>
    `;

    return;
}

  try {
    const modules = {

    index: "./home.js",

    products: "./product.js",

    product: "./product.js",

    brands: "./brand.js",

    brand: "./brand.js",

    blogs: "./blog.js",

    blog: "./blog.js",

    search: "./search.js",

    cart: "./cart.js",

    checkout: "./checkout.js"

};

const file = modules[viewName];

if (!file) {

    target.innerHTML = `

<div class="text-center py-5">

<h2>404</h2>

<p>Page not found.</p>

<a href="index.html" class="btn btn-warning">

Home

</a>

</div>

`;

    return;

}

const viewModule = await import(file);
await viewModule.render(target, params);

} catch (err) {

    console.error(err);

    target.innerHTML = `

<div class="alert alert-danger">

    <h5>Unable to load page</h5>

    <p>${err.message}</p>

</div>

`;

}
}