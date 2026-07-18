// ==========================================================
// Core Utilities
// ==========================================================

// DOM Selector
export const $ = selector => document.querySelector(selector);

// ==========================================================
// Configuration
// ==========================================================

export const CONFIG = {

    API:
        "https://script.google.com/macros/s/AKfycbzw4MSbw-WN4QxPjZKwidKF5dtlEpGpiSjDQ9zPTYVSKMFJNF8LGQx0uANAn3w3HLezIw/exec",

    UPI:
        "9050623210@sbi",

    NAME:
        "HARYANA TOOLS",

    WHATSAPP:
        "919050623210"

};

// ==========================================================
// Currency Formatter
// ==========================================================

export function formatINR(value) {

    return new Intl.NumberFormat(

        "en-IN",

        {

            style: "currency",

            currency: "INR",

            maximumFractionDigits: 0

        }

    ).format(Number(value) || 0);

}

// ==========================================================
// API Service
// ==========================================================

export const api = {

    // ==============================================
    // GET
    // ==============================================

    async get(action, params = {}) {

        try {

            const controller =
                new AbortController();

            const timeout = setTimeout(

                () => controller.abort(),

                6000

            );

            const url =
                new URL(CONFIG.API);

            url.searchParams.set(
                "action",
                action
            );

            Object.entries(params).forEach(

                ([key, value]) => {

                    if (

                        value !== undefined &&
                        value !== null

                    ) {

                        url.searchParams.set(
                            key,
                            value
                        );

                    }

                }

            );

            const response = await fetch(

                url,

                {

                    signal:
                        controller.signal

                }

            );

            clearTimeout(timeout);

            if (!response.ok) {

                throw new Error(

                    `HTTP ${response.status}`

                );

            }

            const json =
                await response.json();
            
            return json.data ?? json;

        }

        catch (error) {

            console.error(

                "GET Error:",

                error

            );

            return [];

        }

    },

      // ==============================================
    // POST
    // ==============================================

    async post(action, data = {}) {

        try {

            // --------------------------------------
            // Google Apps Script Order Endpoint
            // --------------------------------------

            if (action === "order") {

                const params = new URLSearchParams({

                    action,

                    customerName:
                        data.customerName,

                    phone:
                        data.phone,

                    address:
                        data.address,

                    paymentMethod:
                        data.paymentMethod,

                    subtotal:
                        data.subtotal,

                    codCharge:
                        data.codCharge,

                    total:
                        data.total,

                    items:
                        JSON.stringify(data.items || [])

                });

                const response = await fetch(

                    `${CONFIG.API}?${params}`

                );

                if (!response.ok) {

                    throw new Error(

                        `HTTP ${response.status}`

                    );

                }

                return await response.json();

            }

            // --------------------------------------
            // Standard POST Request
            // --------------------------------------

            const controller =
                new AbortController();

            const timeout = setTimeout(

                () => controller.abort(),

                10000

            );

            const response = await fetch(

                `${CONFIG.API}?action=${encodeURIComponent(action)}`,

                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify(data),

                    signal:
                        controller.signal

                }

            );

            clearTimeout(timeout);

            if (!response.ok) {

                throw new Error(

                    `HTTP ${response.status}`

                );

            }

            return await response.json();

        }

        catch (error) {

            console.error(

                "POST Error:",

                error

            );

            return {

                success: false,

                error:

                    error.message ||

                    "Request failed."

            };

        }

    }

};
// ==========================================================
// Application State
// ==========================================================

export const app = {

    // ==============================================
    // Cart
    // ==============================================

    getCart() {

        try {

            return JSON.parse(

                localStorage.getItem("jke_cart")

            ) || [];

        }

        catch {

            return [];

        }

    },

    // ==============================================
    // Cart Totals
    // ==============================================

    getCartTotals() {

    const cart = this.getCart();

    const count = cart.reduce(

        (total, item) =>

            total + Number(item.qty || 0),

        0

    );

    const subtotal = cart.reduce(

        (total, item) =>

            total +

            Number(item.price || 0) *

            Number(item.qty || 0),

        0

    );

    return {

        count,

        subtotal,

        total: subtotal

    };

},

    // ==============================================
    // Save Cart
    // ==============================================

    saveCart(cart) {

        localStorage.setItem(

            "jke_cart",

            JSON.stringify(cart)

        );

        window.dispatchEvent(

            new Event("cart_updated")

        );

    },

    // ==============================================
    // Update Cart
    // ==============================================

    updateCart(

        sku,
        qty,
        price = 0,
        name = "",
        img = ""

    ) {

        const cart = this.getCart();

        const index = cart.findIndex(

            item => item.sku === sku

        );

        if (index >= 0) {

            if (qty <= 0) {

                cart.splice(index, 1);

            }

            else {

                cart[index].qty = qty;

            }

        }

        else if (qty > 0) {

            cart.push({

                sku,

                qty,

                price,

                name,

                img

            });

        }

        this.saveCart(cart);

    },

    // ==============================================
    // Clear Cart
    // ==============================================

    clearCart() {

        this.saveCart([]);

    }

};

// ==========================================================
// Global Bridge
// ==========================================================

window.app = app;