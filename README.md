## mattrugamas.com

[![Deploy](https://github.com/MattRugamas/mattrugamas.com/actions/workflows/jekyll.yml/badge.svg?branch=release)](https://github.com/MattRugamas/mattrugamas.com/actions/workflows/jekyll.yml)

The source for [mattrugamas.com](https://mattrugamas.com). A small personal site built on Jekyll, deployed to GitHub Pages via a GitHub Actions workflow on the `release` branch. Styled with SCSS, templated with Liquid, written in Markdown.

### Stack

- **Jekyll 4.4** for the static site generator
- **Ruby 3.2** (see [`.ruby-version`](.ruby-version); matches CI)
- **Kramdown** (GFM) and **Rouge** for Markdown parsing and syntax highlighting
- **GitHub Pages** for hosting
- **GitHub Actions** for build and deploy (see [`.github/workflows/jekyll.yml`](.github/workflows/jekyll.yml))

### Pages

| URL | Source | Notes |
| --- | --- | --- |
| `/` | [`index.html`](index.html) | Homepage lede and year-grouped post listing |
| `/about` | [`about.html`](about.html) | Bio and contact CTAs |
| `/music` | [`music.html`](music.html) | Music project archive |
| `/resume` | [`resume.html`](resume.html) | Printable web CV |
| `/links/` | [`links.html`](links.html) | Link-in-bio hub (`minimal_chrome: true`) |
| `/changelog` | [`changelog.html`](changelog.html) | Running log of site changes |
| `/tags/<tag>/` | [`tags/`](tags/) | Per-tag post archives |
| `/<post-slug>/` | [`_posts/`](_posts/) | Blog posts (`permalink: /:title` in [`_config.yml`](_config.yml)) |

A custom [`404.html`](404.html) is served for missing URLs on GitHub Pages.

### Project structure

```
_layouts/       base → default | post | tag
_includes/      Shared partials (nav, post list, tags, email obfuscation, etc.)
_data/          YAML data files (see below)
_sass/          SCSS partials, imported by assets/css/styles.scss
_posts/         Blog posts (Markdown)
tags/           Tag archive page stubs
assets/         CSS, JS, images
scripts/        Offline asset generators (excluded from the Jekyll build)
```

**Layout hierarchy:** [`base.liquid`](_layouts/base.liquid) owns `<head>`, nav/footer chrome, analytics, and global scripts. [`default.liquid`](_layouts/default.liquid) wraps page content in `<main>`. Post and tag layouts extend `base` directly with their own `<main>` markup. The links hub sets `minimal_chrome: true` in front matter to swap in a stripped-down header.

### Data files

| File | Purpose |
| --- | --- |
| [`_data/navigation.yml`](_data/navigation.yml) | Primary nav links (Home, About, Music, Résumé) |
| [`_data/tags.yml`](_data/tags.yml) | Canonical tag list; order controls the homepage filter nav |
| [`_data/links.yml`](_data/links.yml) | Sections and links for `/links/` |
| [`_data/findme.yml`](_data/findme.yml) | About page CTA buttons |

### Plugins

Configured in [`Gemfile`](Gemfile) and [`_config.yml`](_config.yml). The Actions workflow builds with the full Gemfile, not GitHub Pages' safe-mode whitelist.

- [`jekyll-feed`](https://github.com/jekyll/jekyll-feed) — RSS / Atom at `/feed.xml`
- [`jekyll-sitemap`](https://github.com/jekyll/jekyll-sitemap) — `sitemap.xml`
- [`jekyll-seo-tag`](https://github.com/jekyll/jekyll-seo-tag) — per-page titles, canonical URLs, Open Graph, and Twitter cards
- [`jekyll-figure`](https://github.com/paulrobertlloyd/jekyll-figure) — captioned `<figure>` blocks in posts
- [`jekyll-tidy`](https://github.com/apsislabs/jekyll-tidy) — HTML output minification

Syntax highlighting is handled by **Rouge** via `highlighter: rouge` in `_config.yml`.

### Site features

- **Dark / light theme** — `data-theme` on `<html>`, toggled via [`theme-toggle.html`](_includes/theme-toggle.html); a synchronous inline script in `base.liquid` reads `localStorage` before first paint to avoid flash
- **Giscus comments** — loaded on post pages via [`giscus-loader.js`](assets/js/giscus-loader.js)
- **Google Analytics (GA4)** — production only (`JEKYLL_ENV=production`); bootstrap inlined in `base.liquid`
- **Obfuscated email** — [`obfuscated-email.html`](_includes/obfuscated-email.html) + [`site.js`](assets/js/site.js) assemble `mailto:` links client-side
- **Random post** — [`random-post.js`](assets/js/random-post.js) is Jekyll-processed (`layout: null`) so the post list is baked in at build time

### Asset scripts

The [`scripts/`](scripts/) directory holds offline generators excluded from the site build:

- `generate-favicons.py` — favicon package from `assets/favicon-source.svg`
- `generate-social-card.py` — 1200×630 OG image at `assets/img/site/social-card.png`

### Local development

Requires Ruby 3.2 (`.ruby-version` / `rbenv` / `rvm` will pick it up automatically):

```bash
bundle install
bundle exec jekyll serve
```

The site will be at `http://localhost:4000`. Analytics and other production-only paths are gated on `jekyll.environment`.

Draft posts can live in `_drafts/` and are previewed with `bundle exec jekyll serve --drafts`.

### Adding content

**New blog post** — create `_posts/YYYY-MM-DD-slug.md` with front matter:

```yaml
---
title: Post title
date: YYYY-MM-DD
tags:
  - website
---
```

Posts inherit `layout: post` from `_config.yml` defaults. Use `{% figure %}` blocks for captioned images (see existing posts).

**New tag** — two steps:

1. Add the tag to [`_data/tags.yml`](_data/tags.yml) (controls filter nav order)
2. Create `tags/<tag>.md`:

```yaml
---
tag: <tag>
permalink: /tags/<tag>/
---
```

Tag pages inherit `layout: tag` from `_config.yml` defaults. Assign the tag in post front matter.

**Link hub / About CTAs** — edit [`_data/links.yml`](_data/links.yml) or [`_data/findme.yml`](_data/findme.yml); no HTML changes needed.

### Deploy workflow

Day-to-day work happens on `main`. When changes are ready to publish, push `main` and promote the same commit to `release`:

```bash
git push origin main
git push origin main:release
```

The GitHub Actions workflow (triggered by pushes to `release`) builds the site with `JEKYLL_ENV=production` and deploys to GitHub Pages. After deploy, `main` and `release` should point at the same commit.

**Branches:** `main` (development) · `release` (production deploy) · `archive/legacy-site` (frozen pre-redesign site, Travis-era `master`)

Update [`changelog.html`](changelog.html) before deploying site changes.

### License

See [`LICENSE`](LICENSE).
