// ==========================================================
// Application Core Bootstrapper & Lifecycle Initialization
// ==========================================================
import { initRouter } from "./router.js";
import { updateCartBadges } from "./layout.js";

document.addEventListener("DOMContentLoaded", () => {
  // Fire routing and synchronize system session badges instantly
  initRouter();
  updateCartBadges();
});