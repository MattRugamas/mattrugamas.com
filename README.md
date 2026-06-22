## mattrugamas.com

[![Deploy](https://github.com/MattRugamas/mattrugamas.com/actions/workflows/jekyll.yml/badge.svg?branch=release)](https://github.com/MattRugamas/mattrugamas.com/actions/workflows/jekyll.yml)

The source for [mattrugamas.com](https://mattrugamas.com). A small personal site built on Jekyll, deployed to GitHub Pages via a GitHub Actions workflow on the `release` branch. Styled with SCSS, templated with Liquid, written in Markdown.

### Stack

- **Jekyll** for the static site generator
- **Kramdown** (GFM) and **Rouge** for Markdown parsing and syntax highlighting
- **GitHub Pages** for hosting
- **GitHub Actions** for build and deploy (see [`.github/workflows/jekyll.yml`](.github/workflows/jekyll.yml))

### Pages

- `/` homepage and post listing
- `/about` short bio
- `/music` music projects
- `/resume` printable web CV
- `/links/` link-in-bio hub, data-driven via [`_data/links.yml`](_data/links.yml)
- `/changelog` running log of site changes
- `/tags/<tag>` per-tag archives

### Plugins

- [`jekyll-feed`](https://github.com/jekyll/jekyll-feed) for RSS / Atom output
- [`jekyll-sitemap`](https://github.com/jekyll/jekyll-sitemap) for `sitemap.xml`
- [`jekyll-seo-tag`](https://github.com/jekyll/jekyll-seo-tag) for Open Graph and SEO metadata
- [`jekyll-figure`](https://github.com/paulrobertlloyd/jekyll-figure) for captioned `<figure>` blocks
- [`jekyll-tidy`](https://github.com/apsislabs/jekyll-tidy) for HTML output minification
- [`rouge`](http://rouge.jneen.net) for syntax highlighting

### Local development

```bash
bundle install
bundle exec jekyll serve
```

The site will be at `http://localhost:4000`.

### Deploy workflow

Day-to-day work happens on `main`. When changes are ready to publish, push `main` and promote the same commit to `release`:

```bash
git push origin main
git push origin main:release
```

The GitHub Actions workflow (triggered by pushes to `release`) builds the site with `JEKYLL_ENV=production` and deploys to GitHub Pages. After deploy, `main` and `release` should point at the same commit.

**Branches:** `main` (development) · `release` (production deploy) · `archive/legacy-site` (frozen pre-redesign site, Travis-era `master`)

### License

See [`LICENSE`](LICENSE).
