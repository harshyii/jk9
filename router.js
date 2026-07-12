// ==========================================================
// Client-Side Hash Router
// ==========================================================
import { renderView } from "./ui.js";

const routes = [
  "index", "products", "product", "brands", "brand", 
  "blogs", "blog", "about", "contact", "search", 
  "cart", "checkout", "terms", "returns", "shipping", "privacy", "faq"
];

function handleRoute() {
  const hash = location.hash || "#/index";
  const [pathPart, queryPart] = hash.slice(2).split("?");
  
  const page = routes.includes(pathPart) ? pathPart : "404";
  const params = Object.fromEntries(new URLSearchParams(queryPart));
  
  let canonical = document.querySelector(`link[rel="canonical"]`);
  if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
  canonical.href = `${location.origin}${location.pathname}${hash}`;

  window.scrollTo(0, 0);
  renderView(page, params);
}

export function initRouter() {
  window.addEventListener("hashchange", handleRoute);
  window.addEventListener("load", handleRoute);
}