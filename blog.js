// ==========================================================
// Blog Module
// ==========================================================

import { api } from "./core.js";

// ==========================================================
// SEO Helpers
// ==========================================================

function setMeta(selector, value) {

    document
        .querySelector(selector)
        ?.setAttribute("content", value || "");

}

function setSEO(post) {

    const title =
        post.Title || "Blog";

    const description =
        post.MetaDescription ||
        post.Excerpt ||
        title;

    const image =
        post.FeaturedImage ||
        post.OGImage ||
        post.Image ||
        post.Image1 ||
        "assets/404.webp";

    const slug =
        post.Slug ||
        post.BlogID ||
        "";

    const url =
        `https://haryana.tools/blog.html?id=${encodeURIComponent(slug)}`;

    document.title =
        `${title} | Haryana Tools`;

    setMeta(
        'meta[name="description"]',
        description.substring(0, 160)
    );

    document
        .querySelector('link[rel="canonical"]')
        ?.setAttribute("href", url);

    setMeta(
        'meta[property="og:title"]',
        title
    );

    setMeta(
        'meta[property="og:description"]',
        description
    );

    setMeta(
        'meta[property="og:image"]',
        image
    );

    setMeta(
        'meta[property="og:url"]',
        url
    );

    setMeta(
        'meta[name="twitter:title"]',
        title
    );

    setMeta(
        'meta[name="twitter:description"]',
        description
    );

    setMeta(
        'meta[name="twitter:image"]',
        image
    );

    let schema =
        document.getElementById("article-schema");

    if (!schema) {

        schema =
            document.createElement("script");

        schema.type =
            "application/ld+json";

        schema.id =
            "article-schema";

        document.head.appendChild(schema);

    }

    schema.textContent =
        JSON.stringify({

            "@context":
                "https://schema.org",

            "@type":
                "Article",

            headline:
                title,

            description:
                description,

            image:
                image,

            author: {

                "@type":
                    "Organization",

                name:
                    post.Author ||
                    "Haryana Tools"

            },

            publisher: {

                "@type":
                    "Organization",

                name:
                    "Haryana Tools"

            },

            mainEntityOfPage:
                url

        });

}

// ==========================================================
// Main Render
// ==========================================================

export async function render(container, params = {}) {

    const hashParams =
        new URLSearchParams(

            window.location.hash
                .split("?")[1] || ""

        );

    const searchParams =
        new URLSearchParams(

            window.location.search

        );

    const blogId =

        params.id ||

        searchParams.get("id") ||

        hashParams.get("id");

    if (blogId) {

        return renderPost(

            container,

            blogId

        );

    }

    document.title =
        "Blogs | Haryana Tools";

    container.innerHTML = `

<div class="mb-4">

    <h1 class="fw-bold">

        Latest Blogs

    </h1>

    <p class="text-muted">

        Buying guides, product comparisons,
        power tools tips and industrial
        equipment articles.

    </p>

</div>

<div
    class="row g-4"
    id="blog-catalog-grid">

    <div class="col-12 text-center py-5">

        <div
            class="spinner-border text-warning">

        </div>

    </div>

</div>

`;

    try {

        const articles =
            await api.get("blogs");

        articles.sort(

            (a, b) =>

                Number(

                    b.SortOrder || 0

                ) -

                Number(

                    a.SortOrder || 0

                )

        );

        const grid =
            document.getElementById(

                "blog-catalog-grid"

            );

        if (!articles.length) {

            grid.innerHTML = `

<div class="col-12">

    <div class="alert alert-light text-center">

        No blog posts available.

    </div>

</div>

`;

            return;

        }

        grid.innerHTML =
            articles.map(post => {

                const title =

                    post.Title ||

                    "Untitled";

                const summary =

                    post.Excerpt ||

                    post.MetaDescription ||

                    "Read this article.";

                const image =

                    post.FeaturedImage ||

                    post.OGImage ||

                    "assets/404.webp";

                const slug =

                    post.Slug ||

                    post.BlogID;

                const date =

                    post.PublishDate ||

                    post.Date ||

                    "";

                return `

<div class="col-md-6 col-lg-4">

    <div class="card h-100 shadow-sm">

        <img

            src="${image}"

            class="card-img-top"

            style="height:220px;object-fit:cover"

            alt="${title}">

        <div class="card-body d-flex flex-column">

            ${date ? `

            <small class="text-muted mb-2">

                ${date}

            </small>

            ` : ""}

            <h2 class="h5 fw-bold">

                ${title}

            </h2>

            <p class="text-muted flex-grow-1">

                ${summary}

            </p>

            <a

                href="blog.html?id=${encodeURIComponent(slug)}"

                class="btn btn-warning">

                Read More

            </a>

        </div>

    </div>

</div>

`;

            }).join("");

    }

    catch (error) {

        document.getElementById(

            "blog-catalog-grid"

        ).innerHTML = `

<div class="alert alert-danger">

    Unable to load blog posts.

</div>

`;

    }

}

// ==========================================================
// Part 2 Starts Here
// ==========================================================

async function renderPost(container, slugId) {

    container.innerHTML = `

<div class="text-center py-5">

    <div class="spinner-border text-warning"></div>

</div>

`;

    try {

        const articles =
            await api.get("blogs");

        const post =
            articles.find(item =>

                String(

                    item.Slug ||

                    item.BlogID ||

                    item.id

                ) ===

                String(slugId)

            );

        if (!post) {

            document.title =
                "Blog Not Found | Haryana Tools";

            container.innerHTML = `

<div class="alert alert-warning text-center">

    <h1 class="h4">

        Blog Not Found

    </h1>

    <p class="mb-0">

        The requested blog article could not be found.

    </p>

</div>

`;

            return;

        }

        // ==========================================
        // SEO
        // ==========================================

        setSEO(post);

        // ==========================================
        // Basic Details
        // ==========================================

        const title =

            post.Title ||

            "Untitled";

        const author =

            post.Author ||

            "Haryana Tools";

        const date =

            post.PublishDate ||

            post.Date ||

            "";

        const image =

            post.FeaturedImage ||

            post.OGImage ||

            post.Image ||

            post.Image1 ||

            "";

        // ==========================================
        // Markdown
        // ==========================================

        let markdown =

            "<p>Content coming soon.</p>";

        if (post.ContentFile) {

            try {

                const response =

                    await fetch(

                        "assets/blogs/" +

                        post.ContentFile

                    );

                if (response.ok) {

                    const text =

                        await response.text();

                    markdown =

                        window.marked

                            ? marked.parse(text)

                            : text;

                }

            }

            catch (error) {

                console.error(

                    "Markdown Error",

                    error

                );

            }

        }

        // ==========================================
        // Render
        // ==========================================

        container.innerHTML = `

<article
    class="mx-auto"
    style="max-width:900px;">

    <nav
        aria-label="breadcrumb"
        class="mb-3">

        <ol class="breadcrumb">

            <li class="breadcrumb-item">

                <a href="index.html">

                    Home

                </a>

            </li>

            <li class="breadcrumb-item">

                <a href="blogs.html">

                    Blogs

                </a>

            </li>

            <li
                class="breadcrumb-item active"
                aria-current="page">

                ${title}

            </li>

        </ol>

    </nav>

    <a
        href="blogs.html"
        class="btn btn-outline-secondary mb-4">

        <i class="bi bi-arrow-left"></i>

        Back to Blogs

    </a>

 

    <header class="mb-4">

        <h1 class="fw-bold">

            ${title}

        </h1>

        <div class="text-muted">

            <i class="bi bi-person"></i>

            ${author}

            ${date ? `

            <span class="mx-2">

                •

            </span>

            <i class="bi bi-calendar3"></i>

            ${date}

            ` : ""}

        </div>

    </header>

    <section
        class="blog-content">

        ${markdown}

    </section>

    <hr class="my-5">

    <div
        class="d-flex justify-content-between align-items-center flex-wrap gap-3">

        <a
            href="blogs.html"
            class="btn btn-warning">

            <i class="bi bi-arrow-left"></i>

            All Blogs

        </a>

        <a

            href="https://wa.me/?text=${encodeURIComponent(location.href)}"

            target="_blank"

            class="btn btn-success">

            <i class="bi bi-whatsapp"></i>

            Share

        </a>

    </div>

</article>

`;

        // ==========================================
        // Scroll To Top
        // ==========================================

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }

    catch (error) {

        console.error(error);

        document.title =
            "Blog | Haryana Tools";

        container.innerHTML = `

<div class="alert alert-danger text-center">

    <h2>

        Unable to load this blog.

    </h2>

    <p>

        Please try again later.

    </p>

</div>

`;

    }

}