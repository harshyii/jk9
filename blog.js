// ==========================================================
// Blog Module
// ==========================================================
import { api } from "./core.js";

export async function render(container, params) {

  const urlParams = new URLSearchParams(window.location.hash.split("?")[1]);
  const blogId = params.id || urlParams.get("id");

  if (blogId) {
    return renderPost(container, blogId);
  }

  container.innerHTML = `
    <div class="mb-4">
      <h2 class="fw-bold">Latest Blogs</h2>
      <p class="text-muted">
        Buying guides, product tips, industry news and useful articles from JK Enterprises.
      </p>
    </div>

    <div class="row g-4" id="blog-catalog-grid">
      <div class="col-12 text-center py-5">
        <div class="spinner-border text-warning"></div>
      </div>
    </div>
  `;

  try {

    const articles = await api.get("blogs");

    const grid = document.getElementById("blog-catalog-grid");

    if (!articles || !articles.length) {

      grid.innerHTML = `
        <div class="col-12">
          <div class="alert alert-light text-center">
            No blog posts available yet.
          </div>
        </div>
      `;

      return;
    }

    grid.innerHTML = articles.map(post => {

      const title =
        post.Title ||
        post.title ||
        "Untitled";

      const summary =
        post.Excerpt ||
        post.Description ||
        post.summary ||
        "Read this article.";

      const image =
        post.Image ||
        post.Image1 ||
        "404.webp";

      const slug =
        post.Slug ||
        post.BlogID ||
        post.id;

      const date =
        post.Date ||
        post["Publish Date"] ||
        "";

      return `

      <div class="col-md-6 col-lg-4">

        <div class="card h-100 shadow-sm">

          <img
            src="${image}"
            class="card-img-top"
            style="height:220px;object-fit:cover;"
            alt="${title}">

          <div class="card-body d-flex flex-column">

            ${date ? `
            <small class="text-muted mb-2">
              ${date}
            </small>
            ` : ""}

            <h5 class="fw-bold">

              ${title}

            </h5>

            <p class="text-muted flex-grow-1">

              ${summary}

            </p>

            <a
              href="#/blog?id=${encodeURIComponent(slug)}"
              class="btn btn-warning">

              Read More

            </a>

          </div>

        </div>

      </div>

      `;

    }).join("");

  } catch (err) {

    document.getElementById("blog-catalog-grid").innerHTML = `
      <div class="alert alert-danger">
        Unable to load blog posts.
      </div>
    `;

  }

}

async function renderPost(container, slugId) {

  container.innerHTML = `
    <div class="text-center py-5">
      <div class="spinner-border text-warning"></div>
    </div>
  `;

  try {

    const articles = await api.get("blogs");

    const post = articles.find(item =>
      String(item.Slug || item.BlogID || item.id) === String(slugId)
    );

    if (!post) {

      container.innerHTML = `
        <div class="alert alert-warning text-center">
          Blog post not found.
        </div>
      `;

      return;
    }

    const title =
      post.Title ||
      "Untitled";

    const author =
      post.Author ||
      "JK Enterprises";

    const date =
      post.Date ||
      post["Publish Date"] ||
      "";

    const image =
      post.Image ||
      post.Image1 ||
      "";

    const content =
      post.Content ||
      "Content coming soon.";

    container.innerHTML = `

      <article class="mx-auto" style="max-width:900px;">

        <a
          href="#/blogs"
          class="btn btn-outline-secondary mb-4">

          ← Back to Blogs

        </a>

        ${image ? `

        <img
          src="${image}"
          class="img-fluid rounded mb-4 w-100"
          style="max-height:420px;object-fit:cover;"
          alt="${title}">

        ` : ""}

        <h1 class="fw-bold mb-3">

          ${title}

        </h1>

        <div class="text-muted small mb-4">

          ${author}

          ${date ? ` • ${date}` : ""}

        </div>

        <div
          class="lh-lg"
          style="white-space:pre-line;">

          ${content}

        </div>

      </article>

    `;

  } catch (err) {

    container.innerHTML = `
      <div class="alert alert-danger">
        Unable to load this blog post.
      </div>
    `;

  }

}