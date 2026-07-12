// ==========================================================
// Procurement Documentation & Industrial Blog Hub Module
// ==========================================================
import { api } from "./core.js";

export async function render(container, params) {
  if (params.id) {
    return renderPost(container, params.id);
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

    grid.innerHTML = articles.map(a => `
      <div class="col-md-6">
        <div class="card h-100 border-0 shadow-sm rounded-0 bg-white p-3 p-md-4 d-flex flex-column border-start border-4 border-warning">
          <h5 class="fw-bold text-dark mb-2">${a.title}</h5>
          <p class="text-muted small mb-3 text-truncate-3" style="font-size:13px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${a.summary || 'Operational system guidelines details and technical trade infrastructure walkthrough updates.'}</p>
          <div class="mt-auto pt-2">
            <a href="#/blog?id=${a.id}" class="btn btn-sm btn-dark rounded-0 font-monospace">Read Documentation Node</a>
          </div>
        </div>
      </div>
    `).join("");
  } catch (err) {
    document.getElementById("blog-catalog-grid").innerHTML = `<div class="alert alert-danger">Error syncing operational literature structures.</div>`;
  }
}

async function renderPost(container, id) {
  container.innerHTML = `<div class="text-center py-5"><div class="spinner-border text-warning"></div></div>`;
  try {
    const post = await api.get("blog", { id });
    if (!post || post.error) {
      container.innerHTML = `<div class="alert alert-warning text-center">Article node not found inside internal publishing clusters.</div>`;
      return;
    }

    container.innerHTML = `
      <div class="bg-white p-4 p-md-5 rounded shadow-sm border mx-auto" style="max-width: 800px;">
        <a href="#/blogs" class="btn btn-sm btn-outline-secondary rounded-0 font-monospace mb-4"><i class="bi bi-arrow-left me-1"></i>Back to Hub</a>
        <h2 class="fw-bold text-dark mb-3">${post.title}</h2>
        <div class="text-muted font-monospace small mb-4 border-bottom border-top py-2 my-2 bg-light px-2">System Asset Index Reference ID: ${post.id}</div>
        <div class="text-secondary lh-lg small-prose" style="font-size:15px; white-space: pre-line;">${post.content}</div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="alert alert-danger">Network fault synchronizing requested documentation block.</div>`;
  }
}