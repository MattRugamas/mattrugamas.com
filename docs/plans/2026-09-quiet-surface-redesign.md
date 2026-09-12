# Quiet Surface: the minimal redesign

Implementation plan for the third redesign of mattrugamas.com. Written for an implementing agent working phase by phase. Read the whole document before touching code; each phase is self-contained but the token system in section 3 is the contract everything else depends on.

**Branch:** `redesign/quiet-surface` (off `main`). Do not touch `redesign/minimalist-ui`; it is an abandoned experiment and is not a reference for this work.

## 1. Brief

The current site (June 2026, "Liquid Glass") is well made but visually loud: floating blurred nav, ambient color washes, serif display type, teal links, card surfaces everywhere, an animated aurora on `/links/`. The owner wants the opposite surface with the same or higher level of craft.

Design read: personal site and blog for a support engineer, read by peers, recruiters, and people who arrived from a post. Redesign, overhaul mode: new visual language, information architecture and content untouched.

The governing idea is **quiet surface, considered depth**. At a glance the site is a plain document: system type, three grays, one column, hairlines instead of boxes, nothing floating, nothing glowing. The craft lives in what happens when you use it: how pages transition, how the nav highlight follows the pointer, how the theme switches, how dates hang in the margin, how focus rings behave, how it prints, how it responds to reduced motion. None of that is visible in a screenshot. All of it is felt.

Dials, for agents that use the design-taste skill: `DESIGN_VARIANCE 4 / MOTION_INTENSITY 4 / VISUAL_DENSITY 3`. Low variance and density are the point. Motion is moderate in quantity but must be high in quality.

### 1.1 Source reference

The system is adapted from a post by @_heyrico ("Steal this clean UI blueprint", July 2026):

- SF Pro, regular and medium only, -0.15px letter spacing
- Type limited to 12, 13, 14, 24px
- Hierarchy built from three grays: `#292929`, `#5D5D5D`, `#9E9E9E`
- Icons at 14px in navigation, 20px in cards
- Radii: 8px navigation, 16px cards, pill CTAs

Adaptations, and why:

| Tweet | This site | Reason |
| --- | --- | --- |
| 12 / 13 / 14 / 24 | 13 / 14 / 16 / 24 | The tweet describes app UI. This is a reading site; 16px body is the floor for long-form prose. Still exactly four sizes. |
| `#9E9E9E` as third text tier | `#9E9E9E` is non-text only | On a near-white page it is 2.7:1. Fails WCAG AA for text. The owner was an accessibility lead; nothing ships below 4.5:1. A darker tertiary is used for text. |
| SF Pro | System stack | SF Pro is not licensed for web embedding. The system stack yields SF Pro on Apple devices and zero font downloads everywhere. |
| No dark mode mentioned | Full dark palette | The site already has a theme toggle; both themes are first-class. |

### 1.2 Decisions already made by the owner

These are settled. Do not re-open them.

1. Fresh branch off `main`. The `redesign/minimalist-ui` branch is ignored.
2. **System font stack.** No web fonts. Remove Google Fonts entirely. Instrument Serif and Geist are retired.
3. **Near-monochrome.** Three-tier gray hierarchy. Teal survives in exactly two places: `:focus-visible` rings and the active tag-filter chip. Links are text-colored and underlined.
4. **`/links/` comes in line.** The aurora goes. Same flat system as the rest of the site.

## 2. Guardrails

Things that do not change unless the owner asks:

- **Information architecture.** Page slugs, `permalink: /:title`, tag URLs, nav labels and order (`Home, About, Music, Résumé`), the `/links/` page's `minimal_chrome` behavior.
- **Content and copy.** Every visible string stays as written, including the footer ("Made with ❤️ on Jekyll and GitHub Pages"), the 404 codec dialogue, and post bodies. Visual redesign is not a copy edit. Exception: the résumé role index numbers (`01`–`04`) are decoration, not content, and are removed (section 4.6).
- **Accessibility wins.** Skip link, focus visibility, `aria-*` on the theme switch, `tabindex="-1"` on `#mainContent`, alt text, ≥ 40×40px hit areas, `prefers-reduced-motion` kill switch, print stylesheet on the résumé.
- **Analytics hooks.** `assets/js/analytics.js` binds to these selectors; keep every one of them present with the same meaning: `nav ul a`, `#theme-toggle`, `#blog-list article h3 a`, `.year-group .year-heading`, `article .date`, `.music-project` and its `h2`/`a`, `.findme a`, `#resume-print-btn`, `.cv-header-contact a`, `.tag-filter .tag-badge`, `.post-footer a`, `footer a`, `.link-hub .link-hub-list a`, `.link-hub-section h2`, `#skipToMainContent`. (`nav.classList.contains('open')` becomes permanently false once the hamburger is removed; that is fine.)
- **Giscus theming.** `giscus-loader.js` reads `localStorage.theme` and `data-theme`; the values `light`/`dark` stay.
- **Stack.** Jekyll, SCSS via `@use`, vanilla JS, no build step, no npm, no new gems. If you think you need a dependency, you do not.
- **Repo rules.** `changelog.html` gets an entry before anything deploys (rule in `.cursor/rules/changelog.mdc`). Deploy only when asked, via `git push origin main && git push origin main:release`.

Mechanical gates that must pass before the branch is considered done are in section 7.

## 3. Design system

This section rewrites `_sass/_settings.scss`. Everything below becomes a custom property or Sass variable there; no other file declares a raw color, font size, or radius. Print overrides in `_sass/resume.scss` are the one exception (they use `pt`).

### 3.1 Type

```scss
$fonts-body:
  -apple-system, BlinkMacSystemFont,
  "Segoe UI Variable", "Segoe UI",
  Roboto, "Helvetica Neue", Arial, sans-serif;
$fonts-source:
  ui-monospace, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
```

Do not use the `system-ui` keyword (locale font bugs on some Android/Linux builds). Delete `$fonts-display` and `$fonts-titles`.

Four sizes. Nothing else exists.

| Token | Size | Line height | Used for |
| --- | --- | --- | --- |
| `--text-xs` | 13px (`0.8125rem`) | 1.5 | Dates, tags, captions, footnotes, footer, résumé meta, section labels |
| `--text-sm` | 14px (`0.875rem`) | 1.45 | Nav, buttons, chips, code blocks, post-footer rows, résumé dt/dd |
| `--text-base` | 16px (`1rem`) | 1.6 (1.65 in post prose) | Body, list titles, excerpts, h2/h3 inside content |
| `--text-lg` | 24px (`1.5rem`) | 1.25 | Every page `h1` (home, post title, about, résumé name, changelog, links, 404) |

Delete `--text-xl`, `--text-2xl`, `--text-3xl`, `--text-display`, and every `clamp()`.

Weights: `--font-weight-normal: 400` and `--font-weight-medium: 500`. Delete `--font-weight-semi` and `--font-weight-bold`. `strong`, `b`, headings, nav, buttons, and `dt` are all 500. Nothing on screen is 600 or 700 (print may use 700).

Tracking: `--tracking: -0.15px` applied on `body` (inherits everywhere at 13–16px). `--tracking-lg: -0.4px` on `h1` only.

Hierarchy is built with weight and color, not size. An `h2` inside a post is 16px/500 in `fg-1`. An `h3` is 16px/500 in `fg-2`. The only thing that is ever 24px is the page's single `h1`.

Root: keep `-webkit-font-smoothing: antialiased`, `-moz-osx-font-smoothing: grayscale`, `text-size-adjust: 100%`. Add `hanging-punctuation: first allow-end` on prose containers (Safari renders it, others ignore). Keep `text-wrap: balance` on headings and `text-wrap: pretty` on prose. `font-variant-numeric: tabular-nums` on anything showing dates or numbers.

### 3.2 Color

Neutral, not warm, not cool. Gray hex values only. Contrast targets in the last column are hard requirements; verify with a tool (e.g. paste pairs into a WCAG checker) and adjust a hex by a few points if a pair misses.

Light (applies under `prefers-color-scheme: light` when no override, and under `[data-theme="light"]`):

| Token | Value | Role | Contrast on bg |
| --- | --- | --- | --- |
| `--color-bg` | `#FAFAFA` | Page background | |
| `--color-surface` | `#F0F0F0` | Code blocks, 404 codec panel | |
| `--color-fg-1` | `#292929` | Primary text, headings, current nav | ≥ 12:1 |
| `--color-fg-2` | `#5D5D5D` | Secondary text: ledes, excerpts, h3, nav idle, summaries | ≥ 6:1 |
| `--color-fg-3` | `#767676` | Tertiary **text**: dates, tags, captions, footer, labels | ≥ 4.5:1 |
| `--color-fg-4` | `#9E9E9E` | **Non-text only**: idle icons, underline color, decorative marks | n/a |
| `--hairline` | `rgba(0,0,0,0.08)` | Every border | |
| `--fill-hover` | `rgba(0,0,0,0.04)` | Hover fills | |
| `--fill-active` | `rgba(0,0,0,0.07)` | Current/selected fills, pressed | |
| `--color-accent` | `#08626A` | Focus ring, active tag chip | ≥ 5:1 |
| `--img-outline` | `rgba(0,0,0,0.10)` | 1px outline on images | |
| `--selection` | `rgba(41,41,41,0.12)` | `::selection` background | |

Dark (`:root` default when system is dark, and `[data-theme="dark"]`):

| Token | Value | Contrast on bg |
| --- | --- | --- |
| `--color-bg` | `#141414` | |
| `--color-surface` | `#1C1C1C` | |
| `--color-fg-1` | `#EDEDED` | ≥ 12:1 |
| `--color-fg-2` | `#A8A8A8` | ≥ 6:1 |
| `--color-fg-3` | `#8A8A8A` | ≥ 4.5:1 |
| `--color-fg-4` | `#5D5D5D` | n/a (non-text) |
| `--hairline` | `rgba(255,255,255,0.09)` | |
| `--fill-hover` | `rgba(255,255,255,0.05)` | |
| `--fill-active` | `rgba(255,255,255,0.09)` | |
| `--color-accent` | `#5DC8D1` | ≥ 8:1 |
| `--img-outline` | `rgba(255,255,255,0.10)` | |
| `--selection` | `rgba(237,237,237,0.14)` | |

Rules:

- `--color-accent` appears in exactly two selectors site-wide: the `focus-ring` mixin and `.tag-badge.active`. Grep for it at the end (section 7). Every other former use of `--color-accent`, `--color-highlight`, `--color-links`, `--color-dates`, `--color-inactive`, `--code-string`, `--code-comment`, `$rose`, `$light-rose` is remapped to an `fg-*` token or deleted.
- Links: `color: inherit; text-decoration: underline; text-decoration-color: var(--color-fg-4); text-decoration-thickness: 1px; text-underline-offset: 0.15em;` and on hover `text-decoration-color: currentColor`. Post-list titles and nav items are the exceptions: no underline at rest, underline (titles) or fill (nav) on hover.
- `color-scheme`: keep `light dark` on `:root`, but set `color-scheme: dark` inside `[data-theme="dark"]` and `color-scheme: light` inside `[data-theme="light"]` so native controls and scrollbars follow the override.
- `@media (prefers-contrast: more)`: `--hairline` becomes `var(--color-fg-3)`.
- Theme-color meta values become `#141414` / `#FAFAFA` in both `base.liquid` (inline head script) and `site.js`.
- Print block in `_settings.scss`: keep, remap to new token names, drop glass/wash entries.

### 3.3 Shape

| Token | Value | Used for |
| --- | --- | --- |
| `--radius-xs` | 4px | Inline code, `kbd` |
| `--radius-sm` | 8px | Nav items, icon buttons, code blocks, link-hub rows, skip link |
| `--radius-md` | 16px | Images and figures, the About photo, link-hub avatar, 404 codec panel |
| `--radius-pill` | 999px | CTAs, tag chips, the résumé print button, 404 actions |

Delete `--radius-lg`. Concentric rule: a rounded child inside a rounded parent has `outer = inner + padding`. If it cannot be satisfied, the child is square.

### 3.4 Space and measure

Keep the existing `--space-1` … `--space-16` scale (4px base). Add `--space-10: 2.5rem` and `--space-24: 6rem`.

One column. `--measure: 40rem` (640px) is the content width for every page. `--measure-wide: 44rem` (704px) is used only by the résumé and changelog. Horizontal page padding `clamp(1rem, 5vw, 2rem)`. The nav, main content, and footer all share the same measure and padding, so there is one left edge running down the page. That alignment is a feature; check it in screenshots.

Delete `--content-hero`, `--content-prose`, `--content-post`, `--content-cv`, `--content-wide`, `--content-gap`.

### 3.5 Motion

| Token | Value |
| --- | --- |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` |
| `--dur-fast` | 160ms |
| `--dur-med` | 240ms |
| `--dur-slow` | 480ms |

Delete `--ease-glass`, `--ease-icon`, `--ease-out-expo`. Never `transition: all`; list properties. Animate only `transform`, `opacity`, `color`, `background-color`, `text-decoration-color`, `border-color`. Gate hover styles behind `@media (hover: hover)`. Keep the global `prefers-reduced-motion: reduce` block in `accessibility.scss`.

### 3.6 Icons

Inline SVGs stay (no icon library; no build). Standardize: `stroke-width="1.5"`, `stroke-linecap="round"`, `stroke-linejoin="round"`, `fill="none"` for outline icons. Sizes: 14×14 in the nav (RSS, sun, moon), 20×20 in link-hub rows. Icon color idle `fg-3`, hover `fg-1`. Fix the theme toggle's moon (currently `fill="currentColor"` at 16px) to a 14px outline moon so the two icons match.

### 3.7 Mixins that survive

`focus-ring` (accent, 2px, offset 2px), `img-outline`, `tabular-nums`. Everything glass-related is deleted: `glass`, `glass-button`, `card`, `ui-shadow`, `text-shadow`, `content-base` (its useful parts move into `main` in `index.scss`), `link-setup` (becomes plain rules on `a`).

Add two:

```scss
// Pill button. $primary = filled.
@mixin button($primary: false) {
  display: inline-flex; align-items: center; justify-content: center; gap: var(--space-2);
  min-height: 2.25rem; padding: 0 var(--space-4);
  border-radius: var(--radius-pill);
  font-size: var(--text-sm); font-weight: var(--font-weight-medium);
  text-decoration: none; cursor: pointer;
  transition: background-color var(--dur-fast) var(--ease-standard),
              color var(--dur-fast) var(--ease-standard),
              transform var(--dur-fast) var(--ease-standard);
  @if $primary {
    color: var(--color-bg); background: var(--color-fg-1); border: 1px solid transparent;
    @media (hover: hover) { &:hover { background: var(--color-fg-2); } }
  } @else {
    color: var(--color-fg-1); background: transparent; border: 1px solid var(--hairline);
    @media (hover: hover) { &:hover { background: var(--fill-hover); } }
  }
  &:active { transform: scale(0.96); }
  &:focus-visible { @include focus-ring; }
}

// Extend a small control's hit area to 40×40 without changing its box.
@mixin hit-area($size: 2.5rem) {
  position: relative;
  &::after {
    content: ""; position: absolute; inset: 50% auto auto 50%;
    width: max(100%, #{$size}); height: max(100%, #{$size});
    transform: translate(-50%, -50%);
  }
}
```

## 4. Page specifications

Shared: `body` is a flex column; `main` grows, has `max-width: var(--measure)`, `width: 100%`, `margin-inline: auto`, padding-top `calc(var(--nav-height) + var(--space-12))`, padding-bottom `var(--space-16)`. `h1` is 24/500/`fg-1`/`--tracking-lg`, margin 0 0 `--space-4`. Pages that formerly centered content (`links`, `404`) now left-align to the column like everything else.

### 4.1 Chrome: nav, footer, skip link

**Nav** (`_includes/navigation.html`, `_includes/minimal-chrome.html`, `_sass/index.scss` nav block):

- `header > nav`: `position: sticky; top: 0; z-index: 10; height: var(--nav-height)` where `--nav-height: 3rem`. Background `var(--color-bg)`, opaque. No blur, no shadow, no radius, no inset. `border-bottom: 1px solid transparent`; `.scrolled` sets it to `var(--hairline)` with a `--dur-med` transition on `border-color`. The existing IntersectionObserver sentinel in `site.js` already toggles `.scrolled`; keep it.
- Inner wrapper aligns to `--measure` and the page padding so "MR" sits on the shared left edge.
- Home mark `.nav-home`: text "MR", 14px/500 `fg-1`, no serif, no italic. Hit area 40×40.
- Links `ul li a`: 14px/500, padding `var(--space-1) var(--space-2)`, `border-radius: var(--radius-sm)`, no underline. `.not-current` is `fg-2`; hover `fg-1`. `.current` is `fg-1` on `var(--fill-active)`. Press `scale(0.96)`.
- Actions: RSS link and theme toggle, 14px icons, `fg-3` idle, `fg-1` hover, 32×32 visible box with `--radius-sm` hover fill, 40×40 hit area via `hit-area`.
- **No hamburger.** Delete `#nav-toggle`, its spans, `.open` rules, `nav-item-in` keyframes, and the toggle/Escape/outside-click JS. The nav is a single row at every width. Below `$bp-md`, hide the `Home` item: in `navigation.html` add `class="nav-item-home"` to the `li` when `item.link == '/'`, and set `.nav-item-home { display: none }` under the breakpoint. The MR mark is the home link. Measured at 360px: MR (40) + three items (~60 each) + two icons (2×40) + gaps ≈ 300px. Fits. As a safety net, the `ul` gets `overflow-x: auto; scrollbar-width: none;` and a 16px `mask-image` fade on both ends; it should never actually scroll.
- **Sliding hover indicator** (the detail people notice second): one `<span class="nav-indicator" aria-hidden="true">` inside the `ul`, absolutely positioned, `background: var(--fill-hover); border-radius: var(--radius-sm); opacity: 0; transition: transform var(--dur-med) var(--ease-out), width var(--dur-med) var(--ease-out), opacity var(--dur-fast)`. On `pointerenter` of any link, JS sets `transform: translateX(link.offsetLeft)` and `width: link.offsetWidth` and opacity 1; on `pointerleave` of the `ul`, opacity 0 (position stays so the next enter slides from where it left). Under `prefers-reduced-motion: reduce` the transitions are 0ms. Without JS, links fall back to a per-item CSS hover fill. `.current` keeps its static fill underneath; the indicator slides over it at the same tone, which reads as one shape moving.
- **View transitions:** `view-transition-name: site-nav` on `header > nav` and `site-footer` on `footer` so they hold still while `main` crossfades (section 5.1).
- `minimal-chrome.html` (used by `/links/`): same bar, MR + theme toggle only. Remove the two `.link-chrome-edge` divs from `base.liquid` and the `viewport-fit=cover` branch; one viewport meta for all pages.

**Footer:** 13px `fg-3`, `border-top: 1px solid var(--hairline)`, padding `var(--space-6) 0`, aligned to the measure (left, not centered), same padding as `main`. Copy unchanged. Links inside follow the global link rule. Delete the `clamp()` font-size and `white-space: nowrap`; let it wrap.

**Skip link:** keep the visually-hidden technique. When focused it renders as a primary pill button at `top: var(--space-2); left: var(--space-2)`.

### 4.2 Home and tag pages (`index.html`, `_layouts/tag.liquid`, `_includes/post-list.html`, `_includes/tag-filter.html`)

- `h1.hello`: 24/500. The `<strong>` (name) is `fg-1`; the rest of the sentence is `fg-2`. Same trick on the tag page ("Posts tagged **website**"). This is the tweet's hierarchy-by-color applied to a headline; no italics, no accent.
- `#lede`: 16 `fg-2`, margin-top `--space-3`, max-width none (the column already constrains it).
- Tag filter: chips are pills, 13px/500, padding `var(--space-1) var(--space-3)`, `fg-2` text, `1px solid var(--hairline)`, hover `fg-1` + `fill-hover`, press `scale(0.96)`. `.active`: `background: var(--color-accent); border-color: var(--color-accent); color: var(--color-bg)`. This is one of the two permitted accent uses. Row margin-top `--space-6`.
- Post list, mobile-first: `#blog-list` margin-top `--space-12`. Year heading 13px mono/400 `fg-3`, tabular. Row: date 13px mono `fg-3` tabular, title 16/500 `fg-1` no underline (hover underline in `fg-4`), excerpt `p` 16 `fg-2` line-height 1.6 margin-top `--space-1`, tags line 13px mono `fg-3` margin-top `--space-2` (keep the `·` separators as they are; one per gap). Rows separated by `--space-8`. Year groups by `--space-12`. **No card, no border, no hover background.** Hover state is title underline plus date shifting `fg-3 → fg-2`.
- **Hanging dates** at `≥ 60em` (the column is 40rem plus up to 2rem padding a side, so a 7rem hang needs at least 8rem of margin; 60em gives exactly that): `article` becomes `display: grid; grid-template-columns: 6rem minmax(0, 1fr); column-gap: var(--space-4); margin-left: -7rem;` so the date and year label sit in the left margin, right-aligned, and the title stays on the shared left edge. Year `h2.year-heading` uses the same `-7rem` offset and `width: 6rem; text-align: right`. Vertical alignment: date baseline matches title baseline (both 16px-line-height-aware; set `padding-top` on the date to `calc((1.6 * 1rem - 1.5 * 0.8125rem) / 2)`). Below 60em the date sits above the title as a normal block. Delete `--blog-date-col` and the old grid.
- Nothing else on the page. No washes, no gradients.

### 4.3 Post (`_layouts/post.liquid`, `_sass/posts.scss`, `_sass/_tags.scss`)

- `h1#post-title` 24/500, margin-bottom `--space-2`.
- `.post-meta`: one line, 13px mono `fg-3`: date, then tags on the same line separated by `·` (adjust markup so `time` and `.post-tags` are inline). Margin-bottom `--space-10`.
- Prose: 16/1.65 `fg-1`, paragraphs `margin: 0 0 var(--space-4)`. Lists inherit; `li` margin-bottom `--space-1`; markers `fg-3`.
- `h2`: 16/500 `fg-1`, `margin: var(--space-10) 0 var(--space-2)`. `h3`: 16/500 `fg-2`, `margin: var(--space-8) 0 var(--space-2)`.
- `em` stays italic. `strong` is 500, not 700.
- Figures: `margin: var(--space-8) 0`, image `border-radius: var(--radius-md)`, `img-outline`, `max-height: 75vh` retained; caption 13 `fg-3`, left-aligned (not centered), margin-top `--space-2`.
- Code blocks `pre.highlight`: `background: var(--color-surface); border: 1px solid var(--hairline); border-radius: var(--radius-sm); padding: var(--space-4); font: 14px/1.6 $fonts-source; overflow: auto; max-height: 60vh`. Inline `code`: `background: var(--color-surface); border: 1px solid var(--hairline); border-radius: var(--radius-xs); padding: 0.05em 0.35em; font-size: 0.9em`.
- **Grayscale syntax theme.** Replace the Rouge mapping with: comments `fg-3` italic; keywords, tags, and declarations `fg-1` weight 500; strings, numbers, symbols `fg-2`; names/attributes `fg-1`; operators and punctuation `fg-2`; `.err` gets `background: var(--fill-active)` instead of a color; `.gd`/`.gi` (diff) `fg-2` with `text-decoration: line-through` for `.gd`. Zero chroma in code.
- Footnotes: hairline top, 13 `fg-3`, `margin-top: var(--space-12)`. `.footnote` superscript links: no underline, weight 500.
- `.post-footer`: hairline top, `margin-top: var(--space-12); padding-top: var(--space-8)`. `dl` rows 14px, `dt` `fg-3` weight 400 (keep the `::after ":"`), `dd` links no underline at rest. The "elsewhere" `ol` becomes 14px with `fg-3` markers. Grid at `$bp-md` stays.
- `.post-comments`: hairline top, same spacing.
- Post-page nav: the extra `Blog` item that appears in the nav on post pages stays (analytics counts it).

### 4.4 About (`about.html`, `_sass/about.scss`)

- Photo first: `width: 100%; height: auto; border-radius: var(--radius-md); img-outline`; no shadow. Margin-bottom `--space-8`.
- `h1` 24/500; name `<strong>` `fg-1`, "Hey, I'm" `fg-2` (same color-hierarchy device as home).
- Paragraphs 16/1.65 `fg-1`, `margin: 0 0 var(--space-4)`. `.brand-mention` and `.brand-logo` unchanged.
- `.about-cta` row: gap `--space-2`, margin-top `--space-8`. `.cta-primary` uses `button(true)`, `.cta-secondary` uses `button()`. Labels unchanged (including the `→`).

### 4.5 Music (`music.html`, `_sass/music.scss`)

- Intro `p` 16 `fg-2`, margin-bottom `--space-10`.
- `.music-projects`: plain stack, `gap: 0`. Each `.music-project`: `padding: var(--space-6) 0; border-top: 1px solid var(--hairline)`; last child also gets `border-bottom`. **No card, no hover surface, no `::before`.**
- `h2` 16/500 `fg-1`, margin-bottom `--space-2`. `li` 16/1.6 `fg-1`, padding `var(--space-1) 0`. `.music-role` 13 mono `fg-3`. Links underlined per global rule.
- Class names stay for analytics.

### 4.6 Résumé (`resume.html`, `_sass/resume.scss`)

Screen:

- Container `.cv` `max-width: var(--measure-wide)`.
- Header grid layout can stay, but: `h1` 24/500; `.cv-tagline` 13 mono `fg-3`; `.cv-header-contact a` 13 mono, underlined per global rule; `#resume-print-btn` uses `button()`. Hairline bottom, `padding-bottom: var(--space-8); margin-bottom: var(--space-12)`.
- Section `h2`: 13px/500 `fg-3`, sentence case (`text-transform: none`, `letter-spacing: inherit`), `padding-bottom: var(--space-3); border-bottom: 1px solid var(--hairline); margin-bottom: var(--space-6)`. Not accent-colored, not uppercase, not mono.
- Profile: first `p` 16/1.6 `fg-1`; second `p` 16 `fg-2`. No size bump.
- Recommendations: `blockquote.cv-testimonial` has **no card, no big quote glyph**. `padding: 0 0 0 var(--space-4); border-left: 1px solid var(--hairline)`. `p` 16/1.6 `fg-1`, upright (not italic, not serif). `cite` 13 mono `fg-3`, upright. Gap between quotes `--space-6`.
- Skills `dl.cv-skills`: two columns at `$bp-md`, `gap: var(--space-4) var(--space-8)`. Each `.cv-skill-row`: **no card**; `dt` 14/500 `fg-1`; `dd` 14 `fg-2` line-height 1.5.
- Experience: **remove the rail, the markers, the pulsing halo, the card surfaces, the scroll-reveal, and the index numbers.** In `resume.html` delete the `<span class="cv-role-index">…</span>` elements; keep `.cv-dates`. In `site.js` delete the `.cv-timeline .cv-role` IntersectionObserver block. In SCSS delete `.cv-timeline::before`, `.cv-role::before/::after`, `.cv-role--current` visual treatment (keep the class in HTML; it does nothing on screen now), `.tl-pending`, `.tl-in`, `@keyframes cv-marker-pulse`.
- Each `.cv-role`: `padding: var(--space-8) 0; border-top: 1px solid var(--hairline)`. At `$bp-md`, `.cv-role-header` is a grid `8rem minmax(0, 1fr)`: dates (13 mono `fg-3`, tabular) in the left column, title + meta in the right. Below `$bp-md`, dates sit above the title. `h3` 16/500 `fg-1`. `.cv-role-meta` 14 `fg-2` (company mark stays via `brand-mention`; the `·` separator stays). `.cv-role-summary` 16/1.6 `fg-2`, upright. `h4` 13/500 `fg-3`, sentence case, `margin: var(--space-6) 0 var(--space-2)`. Bullets 16/1.6 `fg-1`, `margin-bottom: var(--space-2)`.

Print (`@media print` block in `resume.scss`):

- Keep the existing print stylesheet's intent. Update selectors that referenced deleted elements (`.cv-role-index`, rail, markers). Replace `"Courier New"` with `$fonts-source`. Print already forces black on white; verify nothing new leaks (no `fill-*` backgrounds). Page count and page-break behavior should match the current PDF; produce both and compare.

### 4.7 Changelog (`changelog.html`, `_sass/changelog.scss`)

- `.changelog` `max-width: var(--measure-wide)`.
- `h1` 24/500; `.changelog-subtitle` 16 `fg-2`.
- Entry date `h2.changelog-date` 16/500 `fg-1`, tabular. Entries separated by a hairline and `--space-12`.
- Group `h3` 13/500 `fg-3`, sentence case (`Added`, `Changed`, `Fixed`), not uppercase, not accent.
- Lists 16/1.6 `fg-1`; inline `code` matches the post inline code rule.

### 4.8 Links hub (`links.html`, `_data/links.yml`, `_includes/minimal-chrome.html`, `_sass/links.scss`, `_sass/safari-chrome.scss`, `base.liquid`)

- Delete the `.link-aurora` div from `links.html`, every aurora rule, the `main:has(.link-hub)` overrides, the `html:has(.link-hub)::before` override, the `body:has(.link-hub) header > nav` override, and the `.link-chrome-edge` divs and rules. Delete `_sass/safari-chrome.scss` and its `@use` lines; it existed only to fix toolbar tint sampling through blur, which no longer happens.
- Page layout: same column as everything else, left-aligned (not centered). Avatar `4rem`, `border-radius: var(--radius-md)`, `img-outline`, no shadow. `h1` 24/500 margin-top `--space-4`. Tagline 16 `fg-2`.
- Sections: `h2` 13/500 `fg-3`, sentence case, margin `var(--space-10) 0 var(--space-2)`.
- Link rows `.link-hub-list a`: `display: flex; align-items: center; gap: var(--space-3); padding: var(--space-3) var(--space-3); border: 1px solid var(--hairline); border-radius: var(--radius-sm); font-size: var(--text-base); font-weight: 500; color: var(--color-fg-1); text-decoration: none`. Icon 20×20 `fg-3` left. A trailing `↗` glyph (`aria-hidden`, 14px, `fg-4`) right-aligned via `margin-left: auto`. Hover `background: var(--fill-hover)`, icon and glyph go `fg-1`. Press `scale(0.96)`. Rows stacked with `gap: var(--space-2)`; the rounded rows are the only "cards" on the site, and at 8px they read as list rows, not tiles.
- `.link-hub-hint` 13 mono `fg-3`.
- `viewport-fit=cover` branch in `base.liquid` removed (single viewport meta).

### 4.9 404 (`404.html`, `_includes/fox-logo.html`, `_sass/not-found.scss`)

- Content and dialogue unchanged. Layout left-aligned to the column.
- Fox emblem: `fg-2` fill, `width: 4rem`.
- `.not-found-status` 13 mono `fg-3`. `h1` 24/500; the `<strong>` uses the color device (`fg-1` word inside an `fg-2` sentence).
- `.not-found-codec` panel: `background: var(--color-surface); border: 1px solid var(--hairline); border-radius: var(--radius-md); padding: var(--space-6)`. Remove the accent scanline gradient. Header row 13 mono `fg-3`. The `Live` indicator dot stays (it is the joke), rendered in `fg-2` with the existing pulse (opacity only), disabled under reduced motion. `dt` 13/500 `fg-1` mono; `dd` 16 `fg-1`.
- `.not-found-path` 13 mono `fg-3`. Actions: first link `button(true)`, the rest `button()`.

## 5. Where the care lives

These are the interactions that carry the "complexity underneath" brief. Each has a fallback and a reduced-motion behavior.

### 5.1 Cross-document view transitions

Add to `_sass/animations.scss`:

```scss
@view-transition { navigation: auto; }

::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: var(--dur-med);
  animation-timing-function: var(--ease-standard);
}

header > nav { view-transition-name: site-nav; }
body > footer { view-transition-name: site-footer; }

@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) { animation: none !important; }
}
```

Same-origin navigations crossfade `main` while the nav and footer hold. Browsers without support (Firefox at time of writing) simply navigate; nothing to polyfill.

Stretch, only after everything else is green: shared-element title morph. On `pageswap`, if the activation is a same-origin navigation to a post URL, set `view-transition-name: post-title` on the clicked `#blog-list h3 a`; on `pagereveal`, set the same name on `#post-title`, then clear both after the transition finishes. Feature-detect `window.navigation` and `PageSwapEvent`. If it takes more than an hour, drop it; it is a garnish.

### 5.2 Arrival animation (first load only)

Replace the JS-orchestrated entrance in `site.js` and the `.animate-*` classes with CSS:

```scss
html[data-arrive] main > * {
  animation: arrive var(--dur-slow) var(--ease-out) both;
  @for $i from 1 through 8 {
    &:nth-child(#{$i}) { animation-delay: #{($i - 1) * 40}ms; }
  }
}
@keyframes arrive {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: none; }
}
```

In the inline `<head>` script in `base.liquid` (it already runs before paint for the theme), add: set `data-arrive` on `<html>` only when `!matchMedia('(prefers-reduced-motion: reduce)').matches` and the navigation is a cold entry: `performance.getEntriesByType('navigation')[0]?.type !== 'back_forward'` and `document.referrer` is empty or not same-origin. Result: the page rises once when you arrive from outside; moving around inside the site uses the view-transition crossfade instead. Remove the attribute on `animationend` of the last child (or after 1s) so hover transforms never fight a lingering animation layer. Nav is not animated. Delete `entrance-float-in`, `entrance-float-in-nav`, `entrance-fade-in`, and all `collectEntranceItems`/`runEntranceAnimations` JS.

### 5.3 Theme switch

In `site.js`, wrap the theme change: `const apply = () => { …existing attribute/localStorage/meta/giscus code… }; if (document.startViewTransition && !reducedMotion) document.startViewTransition(apply); else apply();`. The whole page crossfades between palettes in `--dur-med`. Do not add `transition: background-color` on `html`/`body` (mixed-timing artifacts on borders and images). Keep the sun/moon icon crossfade (`scale 0.25 → 1`, `blur 4px → 0`, `--ease-standard`, `--dur-med`) as is.

### 5.4 Nav indicator

Specified in 4.1. Add to `site.js`, ~25 lines. Use `pointerenter`/`pointerleave` (not `mouseover`) so it does not fire on touch. Recompute on `resize` only if the indicator is visible.

### 5.5 Nav hairline on scroll

Already sentinel-based (no scroll listener). Keep. Optional upgrade if the implementing agent is comfortable: replace the observer with a CSS scroll-driven animation (`animation-timeline: scroll(root); animation-range: 0 24px`) that fades `border-color` from transparent to `--hairline`, with the observer kept as the fallback under `@supports not (animation-timeline: scroll())`. Not required.

### 5.6 Micro-details checklist

Implement all of these; they are cheap and they are the point.

- `::selection { background: var(--selection); color: inherit; }`
- `-webkit-tap-highlight-color: transparent` on interactive elements, paired with an explicit `:active` fill so touch still gets feedback.
- Hover styles only inside `@media (hover: hover)`.
- `:focus-visible` everywhere via the mixin; never `outline: none` without a replacement.
- 40×40 hit areas on RSS, theme toggle, MR mark, tag chips (chips already exceed it horizontally; extend vertically with `hit-area`).
- Tabular numerals on: dates, year headings, footer years, résumé dates, changelog dates.
- `text-wrap: balance` on all headings; `text-wrap: pretty` on `p` and `li`.
- Images: `img-outline`, `height`/`width` attributes present (they are), `loading="lazy"` on post figures below the first.
- `scrollbar-gutter: stable` on `html` (already).
- Underline offset and thickness set explicitly on every underlined link so descenders never collide.
- Concentric radii audited wherever a rounded element sits inside another (link-hub rows inside nothing, so mostly the 404 panel and code blocks: children inside them are square).
- No `will-change` except transiently on the nav indicator while it is visible.

## 6. Phases

One phase per commit (or small commit series). After every phase: `bundle exec jekyll build` succeeds with no warnings beyond the pre-existing ones, and the pages touched are screenshotted at 375 / 768 / 1280 in both themes and eyeballed. Do not start the next phase with a broken build.

Take **baseline screenshots** of every page/theme/width from `main` before Phase 1 and keep them outside the repo (`/tmp/quiet-surface/before/`); they are the comparison set for Phase 9.

### Phase 0: branch and baseline

- `git switch -c redesign/quiet-surface main`
- Add `docs` to `exclude:` in `_config.yml` so this plan never ships.
- Baseline screenshots (see section 7 for the matrix and commands).

Done when: branch exists, build passes, `/tmp/quiet-surface/before/` has 9 pages × 2 themes × 3 widths.

### Phase 1: tokens and type foundation

Files: `_sass/_settings.scss`, `_layouts/base.liquid`, `_sass/reset.scss` (only if a font rule conflicts), `_sass/main.scss`.

- Rewrite `_settings.scss` per section 3. Keep the file's role as the single source of truth.
- To keep the not-yet-migrated pages compiling during Phases 2–8, add a clearly labeled **temporary compatibility block** at the bottom of `_settings.scss` that aliases the old names to new tokens (`--color-inactive: var(--color-fg-2)`, `--color-dates: var(--color-fg-3)`, `--color-links: var(--color-fg-1)`, `--color-highlight: var(--color-accent)`, `--card-bg: transparent`, `--card-border: var(--hairline)`, `--text-xl: var(--text-base)`, `--text-2xl`/`--text-3xl`/`--text-display: var(--text-lg)`, `--radius-lg: var(--radius-md)`, `--ease-glass: var(--ease-standard)`, `--ease-out-expo: var(--ease-out)`, `--ease-icon: var(--ease-standard)`, `--font-weight-semi`/`--font-weight-bold: var(--font-weight-medium)`, `$fonts-display: $fonts-body`, `$fonts-titles: $fonts-body`, and no-op `glass`, `glass-button` (→ `button()`), `card`, `ui-shadow`, `text-shadow`, `content-base`, `link-setup` mixins). Header comment: `// TEMPORARY COMPAT — delete in Phase 8`. Phase 8 deletes the whole block and the build must still pass, which proves every page migrated.
- `base.liquid`: remove the two `preconnect` links, the font `preload`, the `noscript` stylesheet, and the `minimal_chrome` viewport branch. Update the theme-color values in the inline script. Add the `data-arrive` logic (5.2).
- `site.js`: update the theme-color values.

Done when: build passes; `curl -s localhost:4000 | rg "fonts\.googleapis"` prints nothing; DevTools Network on `/` shows zero font requests and zero third-party requests in dev; the site renders in system type with old layouts still intact (they will look wrong; that is expected).

### Phase 2: chrome and motion layer

Files: `_includes/navigation.html`, `_includes/minimal-chrome.html`, `_includes/theme-toggle.html`, `_layouts/base.liquid`, `_sass/index.scss` (html/body/nav/footer/skip-link blocks only), `_sass/animations.scss`, `_sass/accessibility.scss`, `assets/js/site.js`.

- Nav per 4.1 including hamburger removal, indicator, sticky bar, hairline-on-scroll.
- Footer and skip link per 4.1.
- Remove the `html::before` washes and the iOS wash override.
- View transitions (5.1), arrival animation (5.2), theme switch transition (5.3), micro-details (5.6) that live at the root level.
- 14px icons with 1.5 stroke; redraw the moon as an outline.

Done when: nav is one line at 360px, 768px, 1280px with no wrap and no scroll; keyboard Tab order is skip link → MR → items → RSS → toggle; focus rings visible on all; hover indicator slides between items and disappears on leave; theme toggle crossfades the page in Chrome/Safari and switches instantly in Firefox; navigating `/` → `/about` crossfades `main` while the nav holds; reloading with reduced motion emulated shows no animation anywhere.

### Phase 3: home and tag pages

Files: `_sass/index.scss` (main block), `_includes/post-list.html`, `_includes/tag-filter.html`, `_layouts/tag.liquid`, `index.html`, `_sass/_tags.scss`.

Per 4.2. Delete `--blog-date-col` and the old grid; implement hanging dates.

Done when: at 1280px (and 960px) the date column hangs left of the title edge and the titles align with the nav's MR and the lede's left edge (draw a vertical guide in a screenshot to confirm); at 768px and 375px dates sit above titles; the active chip is the only chroma on the page; excerpts and tags intact; analytics selectors unchanged.

### Phase 4: post pages

Files: `_layouts/post.liquid`, `_sass/posts.scss`, `_sass/_tags.scss`, `assets/js/giscus-loader.js` (verify only).

Per 4.3 including the grayscale Rouge theme.

Done when: `/glass-and-the-machine`, `/the-redesign`, and `/playing-with-jekyll` (has code blocks) render correctly in both themes; code blocks have zero chroma; footnote links return correctly; Giscus loads with matching theme; comments and post footer separated by hairlines only.

### Phase 5: about and music

Files: `about.html`, `_sass/about.scss`, `_includes/findme.html`, `music.html`, `_sass/music.scss`.

Per 4.4 and 4.5.

Done when: About photo is full column width with a 16px radius and 1px outline and no shadow; CTAs are pills with a filled primary; Music has no cards, hairline-separated groups; `.music-project` and `.findme` selectors intact.

### Phase 6: résumé and changelog

Files: `resume.html`, `_sass/resume.scss`, `assets/js/site.js` (remove timeline observer), `changelog.html` (remove nothing; style only), `_sass/changelog.scss`.

Per 4.6 and 4.7. Regenerate the print PDF and compare to the baseline PDF.

Done when: no rail/markers/index numbers/cards/pulse remain on screen; dates in the left column at desktop; print PDF has the same page count as baseline, black text, no gray fills, contact line intact; `#resume-print-btn` and `.cv-header-contact a` present.

### Phase 7: links hub and 404

Files: `links.html`, `_sass/links.scss`, `_sass/safari-chrome.scss` (delete), `_sass/main.scss`, `_includes/minimal-chrome.html`, `404.html`, `_sass/not-found.scss`.

Per 4.8 and 4.9.

Done when: `/links/` has no gradient, no blur, no fixed layers; link rows have 20px icons and a trailing `↗`; the page is left-aligned to the column; iOS Safari toolbar shows the plain bg color with no seam (test in Safari responsive mode or on device); `/404.html` renders the fox and dialogue in grayscale with pill actions.

### Phase 8: cleanup

- Delete the TEMPORARY COMPAT block from `_settings.scss`. Build must pass. If it fails, a page was not migrated; fix that page, do not restore the alias.
- Delete unused mixins, keyframes, JS functions, and SCSS files (`safari-chrome.scss` if not already). Grep for each deleted token name across `_sass`, `_includes`, `_layouts`, `assets`, and root HTML to confirm zero references.
- `README.md`: update the Stack section (no web fonts), Site features (nav has no hamburger; view transitions; arrival animation), and the project structure if a file was removed. Keep it factual.
- `changelog.html`: one entry, dated the day the branch is finished, grouped under Changed / Fixed as appropriate, in the existing voice (specific, technical, complete sentences, references file names in `<code>`). It should explain: the system font stack and removal of Google Fonts; the gray hierarchy and the two accent uses; the sticky flat nav with the sliding indicator and no hamburger; view transitions and the first-load arrival; the hanging date gutter; the grayscale code theme; the résumé simplification; the `/links/` flattening and removal of the aurora and toolbar-tint hacks; the shape system; what was deleted.
- Optional, owner's call: regenerate `assets/img/site/social-card.png` with `scripts/generate-social-card.py` using the new palette. The script depends on the Geist/Instrument TTFs in `scripts/` (gitignored, offline only); if they are absent, skip and note it.

Done when: all gates in section 7 pass.

### Phase 9: QA and comparison

Full matrix in section 7. Produce `/tmp/quiet-surface/after/` and compare with `before/`. Fix anything found. Then stop and hand back to the owner with the list of screenshots; the owner decides when to deploy.

## 7. Verification

### 7.1 Screenshot matrix

Pages: `/`, `/about`, `/music`, `/resume`, `/links/`, `/changelog`, `/tags/website/`, `/glass-and-the-machine`, `/playing-with-jekyll`, `/404.html`.
Themes: light, dark (set `localStorage.theme` or `data-theme` before capture).
Widths: 375, 768, 1280. Full-page captures.

Local server: `bundle exec jekyll serve --port 4000`. Capture with the IDE browser tools or headless Chrome:

```bash
chrome --headless=new --screenshot=/tmp/quiet-surface/after/home-1280-dark.png \
  --window-size=1280,2000 http://127.0.0.1:4000/
```

Print: `chrome --headless=new --print-to-pdf=/tmp/quiet-surface/after/resume.pdf http://127.0.0.1:4000/resume`, compare page count and a visual skim against `before/resume.pdf`.

Reduced motion: emulate via DevTools (Rendering → `prefers-reduced-motion: reduce`) or CDP `Emulation.setEmulatedMedia`, then load `/` cold, toggle theme, hover the nav, navigate to `/about`. Nothing should move.

Keyboard: Tab through `/` and `/resume`; every stop has a visible accent ring; skip link appears on first Tab and works.

### 7.2 Mechanical gates

Run from the repo root after `bundle exec jekyll build`. `changelog.html`, `_posts/`, `README.md`, and `scripts/` are deliberately not searched: they legitimately mention the old design.

```bash
# 1. Source: no glass, washes, aurora, web fonts, toolbar-tint hacks, or hamburger.
#    Expect: no output.
rg -n "backdrop-filter|--glass|--wash|aurora|link-chrome-edge|nav-toggle|fonts\.googleapis|Instrument Serif|Geist|safari-chrome|animate-item|tl-pending" \
  _sass _includes _layouts assets/js assets/css index.html about.html music.html resume.html links.html 404.html

# 2. Built CSS and key built pages carry none of it either.
#    Expect: no output.
rg -n "backdrop-filter|Instrument|Geist|fonts\.googleapis" _site/assets/css/styles.css
rg -n "fonts\.googleapis|nav-toggle|link-aurora|link-chrome-edge" _site/index.html _site/about.html _site/links/index.html _site/resume.html

# 3. Only 400/500 on screen.
#    Expect: matches only inside the @media print block of _sass/resume.scss. Review by eye.
rg -n "font-weight:\s*(600|700|bold)" _sass

# 4. Four sizes only. reset.scss is normalize boilerplate and is skipped; print pt values and
#    the 0.9em inline-code ratio are allowed.
#    Expect: no output.
rg -n "font-size:" _sass -g '!reset.scss' | rg -v "var\(--text-|pt;|0\.9em|inherit"

# 5. Raw colors live only in _settings.scss.
#    Expect: matches only inside the @media print block of _sass/resume.scss (#000, #fff, #555, etc.).
rg -n "#[0-9a-fA-F]{3,6}\b|rgba?\(" _sass -g '!_settings.scss'

# 6. Accent appears in exactly two places.
#    Expect: _settings.scss (two palette definitions + the focus-ring mixin) and
#    index.scss (.tag-badge.active, background + border-color). Nothing else.
rg -n "color-accent" _sass

# 7. No transition: all.  Expect: no output.
rg -n "transition:\s*all" _sass

# 8. Compat block deleted.  Expect: no output.
rg -n "TEMPORARY COMPAT" _sass
```

### 7.3 Lighthouse

On `/` and `/glass-and-the-machine`, mobile preset: Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95. Zero font requests. LCP is the `h1` text; it should paint in the first frame.

### 7.4 Contrast

Verify each `fg-*` text token against `--color-bg` in both themes, and `--color-bg` text on `--color-fg-1` (primary buttons) and on `--color-accent` (active chip). Record the ratios in the changelog entry or the PR description.

## 8. Out of scope (backlog, not this branch)

- Shared-element post title morph (5.1 stretch), if it was dropped.
- Footnote hover previews on post pages.
- Regenerating the social card (Phase 8 optional).
- A blog post about the redesign. The owner writes those.
- Any copy changes, including the footer heart.

## 9. Reference

- Tweet: https://x.com/_heyrico/status/2079628240944263565
- Repo skills consulted: `.claude/skills/make-interfaces-feel-better/` (radii, hit areas, tabular numerals, icon crossfade values, scale-on-press 0.96), `.agents/skills/redesign-existing-projects/` (audit and fix order), `.agents/skills/design-taste-frontend/` (dial reading, redesign protocol, eyebrow restraint, shape lock).
- View Transitions (cross-document): https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using#cross-document_view_transitions
- Scroll-driven animations: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations
