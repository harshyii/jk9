// DOM Selector Shorthand Helper used by ui.js
export const $ = (selector) => document.querySelector(selector);

// ==========================================================
// CORE PLATFORM DATA MATRIX UTILITIES (OFFLINE COMPATIBLE)
// ==========================================================
export const CONFIG = {
  API: "https://script.google.com/macros/s/AKfycbxfyBNEi6hXXLZsH_Nra_XH6AzF5Xk7P80dbmW3cgRA1P7oVUj_Fd9fuC8bVVOocQ-omg/exec",
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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    // REMOVED: mode: 'no-cors'
    const response = await fetch(`${CONFIG.API}?action=${action}`, { 
      signal: controller.signal 
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error("Network tier rejection token.");
    
    // Now you can safely parse the JSON
    return await response.json(); 
  } catch (err) {
    // ... rest of your error handling
  }
  },
  
  async post(action, data) {
    try {
      const response = await fetch(`${CONFIG.API}?action=${action}`, {
        mode: 'no-cors',
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