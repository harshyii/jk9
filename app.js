// ==========================================================
// APPLICATION INITIALIZATION ENTRY POINT MATRIX
// ==========================================================
import * as Home from "./home.js";
import * as Product from "./product.js";

import { initRouter } from "./router.js";
import { updateCartBadges } from "./layout.js";

document.addEventListener("DOMContentLoaded", () => {
  // Initialize navigation routing layout engines
  initRouter();

  // Attach immediate reactive listeners to custom storage update sequences
  window.addEventListener("cart_updated", () => {
    updateCartBadges();
  });

  // Initial runtime load update signature pass
  setTimeout(() => {
    updateCartBadges();
  }, 50);
});