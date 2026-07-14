// ==========================================================
// Central UI View Router Broker Matrix
// ==========================================================
import { $ } from "./core.js";
import { getHeaderHTML, getFooterHTML, initHeaderEvents } from "./layout.js";

// Static Policy & Legal Layout Module Render Templates
const legalTemplates = {
  about: `<h2>About JK Enterprises</h2><p>India's premium B2B wholesale industrial procurement channel network distribution system.</p>`,
  contact: `<h2>Contact Wholesale Support</h2><p>Direct Corporate Helpline: <strong>+91 9050623210</strong></p><p>Email allocations: support@jkenterprises.co.in</p>`,
  terms: `<h2>Terms of Wholesale Allocation</h2><p>All wholesale tier transactions operate strictly under corporate trade credit policy guidelines.</p>`,
  privacy: `<h2>Data Privacy Standards</h2><p>Corporate accounts data architectures are heavily secured with internal encryption layers.</p>`,
  shipping: `<h2>Logistics & Fleet Freight Shipping</h2><p>Nationwide logistical delivery pipelines via certified overland heavy transport networks.</p>`,
  returns: `<h2>B2B Commercial Return Pipeline</h2><p>Goods returns are processed solely under original factory warranty verification procedures.</p>`,
  faq: `<h2>Frequently Asked Inquiries</h2><p>Standard minimum batch order allocations begin at baseline product tiers.</p>`
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
  if (legalTemplates[viewName]) {
    target.innerHTML = `<div class="bg-white p-4 rounded shadow-sm">${legalTemplates[viewName]}</div>`;
    return;
  }

  try {
    let viewModule;
    switch (viewName) {
      case "index":
        viewModule = await import("./home.js");
        break;
      case "products":
      case "product":
        viewModule = await import("./product.js");
        break;
      case "brands":
      case "brand":
        viewModule = await import("./brand.js");
        break;
      case "blogs":
      case "blog":
        viewModule = await import("./blog.js");
        break;
      case "search":
        viewModule = await import("./search.js");
        break;
      case "cart":
        viewModule = await import("./cart.js");
        break;
      case "checkout":
        viewModule = await import("./checkout.js");
        break;
      default:
        target.innerHTML = `<div class="text-center py-5"><h3>404 - Content Matrix Not Found</h3><a href="#/index" class="btn btn-warning mt-3">Back to Hub</a></div>`;
        return;
    }

    // Trigger the view construction execution module method
    if (viewModule && typeof viewModule.render === "function") {
      await viewModule.render(target, params);
    }
  } catch (err) {
    console.error("View initialization fault:", err);
    target.innerHTML = `<div class="alert alert-danger">Critical infrastructure communication failure while processing view route template.</div>`;
  }
}