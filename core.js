// DOM Selector Shorthand Helper used by ui.js
export const $ = (selector) => document.querySelector(selector);

// ==========================================================
// CORE PLATFORM DATA MATRIX UTILITIES (OFFLINE COMPATIBLE)
// ==========================================================
export const CONFIG = {
  API: "https://script.google.com/macros/s/AKfycbyOU12nPtoE_cyGZO9R3Sd2DFHYtTovROP0U4HIcB3MhD4QFZoh68T4MtMu-t7FIQ2g/exec",
  UPI: "9050623210@sbi",
  NAME: "JK Enterprises",
  WHATSAPP: "919050623210" // Destination phone framework array with country code prefix
};

export const formatINR = (num) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
};

export const api = {
  async get(action) {
    try {
      // Set up a quick 6-second timeout to handle hanging or ultra-slow connections gracefully
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(`${CONFIG.API}?action=${action}`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error("Network tier rejection token.");
      
      const data = await response.json();
      
      // If we are getting the product manifest, preserve a snapshot locally as a fallback cache
      if (action === "products" && data && data.length > 0) {
        localStorage.setItem("jke_cached_products", JSON.stringify(data));
        localStorage.setItem("jke_cache_timestamp", Date.now());
      }
      
      return data;
    } catch (err) {
      console.warn(`[Network Layer Slow/Offline] Falling back to local mirror cache for action: ${action}`);
      
      // Look for data inside local memory if the API connection drops or slows down
      if (action === "products") {
        const cachedData = localStorage.getItem("jke_cached_products");
        if (cachedData) {
          return JSON.parse(cachedData);
        }
      }
      
      throw new Error("Network offline and no local data found.");
    }
  },
  
  async post(action, data) {
    try {
      const response = await fetch(`${CONFIG.API}?action=${action}`, {
        method: "POST",
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (err) {
      console.error("API Write Rejection (Using fallback local pipeline):", err);
      // Return a temporary client-side mock id if the script database sheet is out of reach
      return { 
        success: false, 
        fallback: true,
        orderId: "JKE-OFFLINE-" + Math.floor(10000 + Math.random() * 90000) 
      };
    }
  }
};

// Global reactive application cart storage layout architecture mappings
export const app = {
  getCart() {
    try {
      return JSON.parse(localStorage.getItem("jke_cart")) || [];
    } catch (e) {
      return [];
    }
  },

  getCartTotals() {
    const cart = this.getCart();
    const count = cart.reduce((acc, item) => acc + Number(item.qty || 0), 0);
    const subtotal = cart.reduce((acc, item) => acc + (Number(item.price || 0) * Number(item.qty || 0)), 0);
    return { count, subtotal };
  },

  saveCart(cart) {
    localStorage.setItem("jke_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart_updated"));
  },
  
  updateCart(sku, qty, price, name, img) {
    let cart = this.getCart();
    const index = cart.findIndex(item => item.sku === sku);
    if (index > -1) {
      if (qty <= 0) cart.splice(index, 1);
      else cart[index].qty = qty;
    } else if (qty > 0) {
      cart.push({ sku, qty, price, name, img });
    }
    this.saveCart(cart);
  },

  clearCart() {
    this.saveCart([]);
  }
};

// Global safe bridge for script engines that don't explicitly handle ES6 imports
window.app = app;