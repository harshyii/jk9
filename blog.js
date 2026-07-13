// ==========================================================
// Procurement Documentation & Industrial Blog Hub Module (Corrected)
// ==========================================================
import { api } from "./core.js";

export async function render(container, params) {
  // Check location search string fallback parameters safely
  const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
  const blogId = params.id || urlParams.get('id');

  if (blogId) {
    return renderPost(container, blogId);
  }

  container.innerHTML = `
    <h4 class="fw-bold text-dark border-bottom pb-2 mb-4">Industrial Buying Guides & System Framework Documents</h4>
    <div class="row g-4" id="blog-catalog-grid">
      <div class="col-12 text-center py-5"><div class="spinner-border text-warning"></div></div>
    </div>
  `;

  try {
    const articles = await api.get("blogs");
    const grid = document.getElementById("blog-catalog-grid");

    if (!articles || articles.length === 0) {
      grid.innerHTML = `<p class="text-muted text-center py-3">No trade reference sheets updated currently.</p>`;
      return;
    }

    grid.innerHTML = articles.map(a => {
      const title = a["Title"] || a["title"] || "Untitled Document";
      const summary = a["Excerpt"] || a["summary"] || "Operational system guidelines details.";
      const slug = a["Slug"] || a["id"];

      return `
        <div class="col-md-6">
          <div class="card h-100 border-0 shadow-sm rounded-0 bg-white p-3 p-md-4 d-flex flex-column border-start border-4 border-warning">
            <h5 class="fw-bold text-dark mb-2">${title}</h5>
            <p class="text-muted small mb-3" style="font-size:13px;">${summary}</p>
            <div class="mt-auto pt-2">
              <a href="#/blog?id=${encodeURIComponent(slug)}" class="btn btn-sm btn-dark rounded-0 font-monospace">Read Documentation Node</a>
            </div>
          </div>
        </div>
      `;
    }).join("");
  } catch (err) {
    document.getElementById("blog-catalog-grid").innerHTML = `<div class="alert alert-danger">Error syncing operational literature structures.</div>`;
  }
}

async function renderPost(container, slugId) {
  container.innerHTML = `<div class="text-center py-5"><div class="spinner-border text-warning"></div></div>`;
  try {
    const articles = await api.get("blogs");
    const post = articles.find(a => String(a["Slug"] || a["BlogID"]) === String(slugId));

    if (!post) {
      container.innerHTML = `<div class="alert alert-warning text-center">Article node [${slugId}] not found inside internal publishing clusters.</div>`;
      return;
    }

    const title = post["Title"] || "Untitled Document";
    const content = post["Content"] || "No content exposed.";
    const author = post["Author"] || "JK Enterprises";

    container.innerHTML = `
      <div class="bg-white p-4 p-md-5 rounded shadow-sm border mx-auto" style="max-width: 800px;">
        <a href="#/blogs" class="btn btn-sm btn-outline-secondary rounded-0 font-monospace mb-4"><i class="bi bi-arrow-left me-1"></i>Back to Hub</a>
        <h2 class="fw-bold text-dark mb-3">${title}</h2>
        <div class="text-muted font-monospace small mb-4 border-bottom border-top py-2 my-2 bg-light px-2">Author Reference Matrix: ${author}</div>
        <div class="text-secondary lh-lg" style="font-size:15px; white-space: pre-line;">${content}</div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="alert alert-danger">Network fault synchronizing requested documentation block.</div>`;
  }
}