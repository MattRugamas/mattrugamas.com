---
layout: post
title: "The Redesign"
date: 2026-03-31
---

I've been sitting on a version of this site that I built sometime around 2018 or 2019, back when I was learning more front-end seriously and wanted a place to practice. It worked, mostly. The bones were fine. But it had the kind of accumulated debt that happens when you build something to learn and then never really go back to treat it like a real project.

{% figure caption:"Original Site Design Circa 2019" class:"shadow_image" %}
![original-design](/assets/img/posts/original-design.png){:class="img-responsive"}
{% endfigure %}

A few weeks ago I decided to try and change that.

## What It Was

The old site was functional but a little rough around the edges. The CSS was desktop-first, which meant I was patching mobile as an afterthought. There were no design tokens, just magic numbers scattered across files, colors hardcoded inline and three different breakpoint values that didn't agree with each other. The navigation would overflow on small screens with no fallback. The resume page was outdated by about five years. And there was no light mode, which felt increasingly like a gap.

The content wasn't much better. My bio was vague. The homepage intro led with a job title. The music and resume sections lived awkwardly together on the About page, which made neither feel intentional.

None of this was broken, exactly. But it wasn't a site I'd hand to someone who asked to see something about me.

## What Changed

I approached this in a few passes.

The first was architectural. I converted the whole stylesheet to mobile-first; base styles for small screens, `min-width` breakpoints layering in the desktop layout. I introduced a proper design token system using CSS custom properties: a spacing scale, a type scale, a named color palette. Every color reference in the codebase now points to a variable instead of a hardcoded value. That groundwork made the light/dark mode toggle possible, and honestly easier than I expected. It's just a `data-theme` attribute on the root element, with a small script in `<head>` that reads `localStorage` before the first paint so there's no flash[^1].

The second pass was structural. I rebuilt the About page around CSS Grid instead of the flexbox `column-reverse` trick I was using before. I extracted music into its own page. I rebuilt the resume as an actual web CV with semantic HTML: proper headings, `<article>` elements per role, a `<dl>` for skills. The navigation got a hamburger menu for mobile and a somewhat cleaner active-state treatment.

The third pass was content. I rewrote the homepage intro and the About bio to say something more specific and honest about the kind of work I do. The framing I landed on, working at the intersection of customers, code and product, is more accurate than any job title I've held and it holds up across the kinds of roles I'm looking at next.

## What's Still The Same

The tech stack is unchanged. Still [Jekyll](https://jekyllrb.com), still [GitHub Pages](https://pages.github.com), still a `git push` to deploy. I wrote a whole other post about why I'm keeping that setup, but the short version is: it's the right tool for what this site actually is. I didn't need to migrate to something more complex to make it better. I just wanted to clean up the CSS and fix the copy.

The dark theme is still the default. The color palette is the same, a dark charcoal background with warm cream text and teal accents. What's new is a light mode that maps those same values to their warm-background counterparts, keeping the same character just with the values flipped.

## On Making Personal Sites

There's something satisfying about treating a personal site like a real project rather than a test environment you keep meaning to clean up. The design constraints are low-stakes in a useful way, nobody's filing a bug report if something looks slightly off, but that also means there's no excuse not to just fix the thing that's been bothering you.

This site is a work in progress in the most literal sense. The blog is thin. There's probably still some CSS somewhere that's doing too much work. But it's a better version than what was here before, and that feels like the right direction.

[^1]: The script has to run synchronously in `<head>`, before the browser paints the body. Moving it to an external file with `defer` would add a blocking request and reintroduce the flash, which defeats the point.

