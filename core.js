// ==========================================================
// Core Engine (Config, API, Utilities, Cart)
// ==========================================================
export const CONFIG = {
  API: "https://script.google.com/macros/s/AKfycby_aDi_kn_ary8bBuUn0q4hrP2bKfKLQeDHvI6XgI7QCflUc6pOH4V0WCzkauEiH0FjSA/exec",
  UPI: "9050623210@sbi",
  NAME: "JK Enterprises"
};

// Network Fetcher
export const api = {
  get: async (action, params = {}) => {
    const query = new URLSearchParams({ action, ...params }).toString();
    const res = await fetch(`${CONFIG.API}?${query}`);
    return res.json();
  },
  post: async (action, data) => {
    const res = await fetch(`${CONFIG.API}?action=${action}`, { method: "POST", body: JSON.stringify(data) });
    return res.json();
  }
};

// Global Reactive App State
export const app = {
  cart: JSON.parse(localStorage.getItem("jk_cart")) || [],
  cache: {},
  
  updateCart(id, q, price, name, img) {
    const idx = this.cart.findIndex(i => i.id === id);
    if (q <= 0) { if (idx > -1) this.cart.splice(idx, 1); }
    else if (idx > -1) this.cart[idx].q = q;
    else this.cart.push({ id, q, price, name, img });
    localStorage.setItem("jk_cart", JSON.stringify(this.cart));
    document.dispatchEvent(new Event("cartUpdated"));
  },
  
  getCartTotals(isCOD = false) {
    const subtotal = this.cart.reduce((sum, i) => sum + (i.price * i.q), 0);
    const codFee = isCOD ? Math.round(subtotal * 0.05) : 0;
    return { subtotal, codFee, total: subtotal + codFee, count: this.cart.reduce((sum, i) => sum + i.q, 0) };
  },
  
  clearCart() {
    this.cart = [];
    localStorage.removeItem("jk_cart");
    document.dispatchEvent(new Event("cartUpdated"));
  }
};

// Utilities
export const $ = (sel) => document.querySelector(sel);
export const formatINR = (amt) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amt);
export const getUPIString = (amt, refId) => `upi://pay?pa=${CONFIG.UPI}&pn=${encodeURIComponent(CONFIG.NAME)}&am=${amt}&cu=INR&tn=${encodeURIComponent('Order ' + refId)}`;