---
layout: post
title: "Still on Jekyll, Probably Forever"
date: 2026-04-02
---

I've rebuilt this site a few times now. Not a full rebuild, more like the kind of thing where you touch one CSS file and end up rewriting three others. Each time I do it, I think about whether I should just... do it properly. Migrate to something modern. Maybe Next.js. Maybe Astro. Maybe whatever the new thing is by the time you're reading this.

{% figure caption:"A Classic Case of Old Versus New" class:"shadow_image" %}
![old-vs-new](/assets/img/oldvsnew.png){:class="img-responsive"}
{% endfigure %}

Each time, I end up back at the same place: a text editor, a folder of Markdown files, and a `git push` that deploys to GitHub Pages in about ninety seconds. No build server. No monthly bill. No framework to upgrade around. Just HTML and CSS, served from an edge node somewhere, loading fast on whatever connection you're on.

I want to think out loud about why. It's not because I haven't looked at the alternatives.

## What This Site Actually Is

A personal site is a weird thing to optimize. It's not a product. It's not a dashboard. Nobody is going to bounce if your page load is 300ms instead of 100ms. The requirements are relaxed: a place for text, the occasional photo, links I want to share, maybe some thoughts about things I've been working on or listening to. That's it.

When I think about what this site needs, the list is short: serve HTML fast, don't cost money, don't break and let me write posts in a format I'll still be able to read in ten years. Markdown in a git repo checks all of those. It's also portable; if GitHub Pages disappears or changes its pricing, I can point the same files at Netlify, Cloudflare Pages, or an S3 bucket in about twenty minutes.

That's a different kind of reliability than "the framework is well-maintained." It's the reliability of boring, stable technology that doesn't have anywhere to go.

## The Case Against Tech Like React (for this)

I want to be careful here. I've worked with React heavily before, debugging it, reading through it, explaining it, it's great. But when I think about what I'd be adding to this site by reaching for it, I mostly come up with a list of new problems:

A JavaScript bundle to ship to every visitor. A Node runtime to keep alive somewhere (or a build step to manage). Framework versions to update. Dependencies that drift. A dev server that occasionally needs restarting. A bunch of tooling between me and the thing I actually want to do, which is write something and publish it.

For a site with no interactivity, no real-time data, no user accounts, no dynamic server-side logic, that tradeoff is hard to justify. The thing you're optimizing for with a React app is developer ergonomics and component reuse. I have three pages. I don't need component reuse. I need to write a post and not think about it until next time.

Jekyll's output is just files. Which is, at the end of the day, what a website is.

## The Nostalgia Is Real, But It's Not The Point

Another point in the back of my mind is that there's something that genuinely appeals to me about the personal site as a format. Not in a precious, "the web was better in 2012" way. More that I still believe in the idea of having a place online that is yours, that doesn't route through an algorithm, that doesn't disappear when a platform gets acquired, that you don't have to fight to get your own posts back out of.

I spent years being reasonably active on social media. I'm mostly not anymore. Part of that is the obvious stuff, the toxicity, the engagement optimization, the way that every platform eventually becomes a worse version of itself. But part of it is simpler: I'd rather have a URL I control than a post that lives inside someone else's product.

There's a reason the people I find most interesting online tend to have personal sites. The act of maintaining one, even a simple one, is a small signal that someone thinks their thoughts are worth putting somewhere permanent.

## What I Actually Use It For

Honestly? Not enough. The archive on this site is thin. But I've found that having it *here*, in a format I control, in a setup I understand end-to-end, makes it easier to write when I do want to. There's no friction between having a thought and publishing it. I open a file, write some Markdown, push to a branch, and it's live. The whole process from draft to published is maybe five minutes if I don't overthink the title.

That frictionlessness is something I've come to value. It's why I'm not migrating to something with more features, more flexibility, more configuration surface area. Features are friction when you don't need them. I've got the features I need, and they're working fine.

So we're still on Jekyll in 2026. Probably forever, or at least until GitHub Pages does something unforgivable, which seems unlikely. And if they do, the files are right here.