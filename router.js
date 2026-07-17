// ==========================================================
// Router
// ==========================================================

import { renderView } from "./ui.js";

// ==========================================================
// Pages
// ==========================================================

const PAGES = {

    "": "index",

    "index.html": "index",

    "products.html": "products",

    "product.html": "product",

    "brands.html": "brands",

    "brand.html": "brand",

    "blogs.html": "blogs",

    "blog.html": "blog",

    "search.html": "search",

    "cart.html": "cart",

    "checkout.html": "checkout",

    "about.html": "about",

    "contact.html": "contact",

    "faq.html": "faq",

    "privacy.html": "privacy",

    "returns.html": "returns",

    "shipping.html": "shipping",

    "terms.html": "terms",

    "404.html": "404"

};

// ==========================================================
// Helpers
// ==========================================================

function getPage() {

    const file =

        location.pathname

            .split("/")

            .pop() ||

        "";

    return PAGES[file] || "404";

}

function getParams() {

    return Object.fromEntries(

        new URLSearchParams(

            location.search

        )

    );

}

function updateCanonical() {

    let canonical =

        document.querySelector(

            'link[rel="canonical"]'

        );

    if (!canonical) {

        canonical =

            document.createElement(

                "link"

            );

        canonical.rel =

            "canonical";

        document.head.appendChild(

            canonical

        );

    }

    canonical.href =

        location.origin +

        location.pathname +

        location.search;

}
// ==========================================================
// Route Handler
// ==========================================================

function handleRoute() {

    updateCanonical();

    window.scrollTo({

        top: 0,

        left: 0,

        behavior: "instant"

    });

    renderView(

        getPage(),

        getParams()

    );

}

// ==========================================================
// Router
// ==========================================================

export function initRouter() {

    window.addEventListener(

        "DOMContentLoaded",

        handleRoute

    );

    window.addEventListener(

        "popstate",

        handleRoute

    );

}
