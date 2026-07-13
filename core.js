// ==========================================================
// CORE PLATFORM DATA MATRIX UTILITIES
// ==========================================================
export const CONFIG = {
  API: "https://script.google.com/macros/s/AKfycbwm6J7cIAbV6Hz7KAxH8MwtIPN97jKk4dIdWvOPDWtUCDIOwUneT_-APIo2WXbMqkY/exec",
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
      const response = await fetch(`${CONFIG.API}?action=${action}`);
      if (!response.ok) throw new Error("Network tier rejection token.");
      return await response.json();
    } catch (err) {
      console.error("API Fetch Error:", err);
      throw err;
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
      console.error("API Write Rejection:", err);
      return { success: false, error: err.toString() };
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