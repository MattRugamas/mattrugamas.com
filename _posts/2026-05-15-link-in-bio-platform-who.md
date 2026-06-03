---
layout: post
title: "Link-in-bio platform who?"
date: 2026-05-15
---

A few days ago I added a `/links/` page to this site. The kind of page that lives one tap away from an Instagram bio, a stack of buttons leading to my band, my Discord, my Steam profile, that sort of thing. The whole feature is under a hundred lines of HTML, a small YAML file, and a few inline SVGs. It took less time to build than the [Linktree](https://linktr.ee) signup flow would have.

That's the thing I want to think out loud about. Not whether you should build your own. The question that's been chewing on me is the opposite one. Linktree is doing real numbers. [Beacons](https://beacons.ai) has venture funding[^1]. There's [Bento](https://bento.me), [Stan](https://stan.store), [Carrd](https://carrd.co)-as-a-link-page, and probably four more by the time you read this. Why is a stack of links a *segment*?

## What The Page Actually Is

A YAML file at `_data/links.yml` with sections and items. A Jekyll loop in `links.html`. A handful of `if` branches that drop in a platform icon based on the URL. That's it. Adding Discord this week meant adding three lines to the data file and a small SVG `path` to the template. No deploy step beyond `git push`.

If "render a list of links" were the whole problem, the segment wouldn't exist.

## What These Platforms Are Actually Selling

It's worth listing what these platforms do that a static page doesn't. Not to defend them, to be honest about why the market is the size it is.

The most obvious thing is editorial UX. A CMS you don't perceive as a CMS. Drag a row to reorder, tap a button to add a link, see a live mobile preview, save means published. There's no "you forgot to commit." There's no concept of a commit.

Then there's per-link analytics, surfaced as something a creator wants to look at. Not events flowing into GA4 that you'd need to filter and join to see anything useful. A list with click counts next to each row, sortable by date. Something you'd actually open.

Theming presets answer the "I want pink rounded buttons today" question in two clicks. No SCSS variables, no breakpoint reasoning, no thought about whether the contrast still passes.

The monetization surfaces are where the segment actually makes money. Tip jars, pay-per-message DMs, lead capture forms, embedded shops. These aren't link-list features, they're the actual revenue-adjacent surfaces that make the platforms profitable, and they're why "the link page" can host a whole creator business now[^2].

The last thing is a recognized URL shape. `linktr.ee/me` reads as a known thing to people who don't think in domains. Vendor branding doubles as discovery.

My page does precisely one of those five. I didn't notice it was missing the other four because none of them are jobs I need done. My YAML edit is the editorial UX. My GA dashboard is fine. My theme is the site's theme. I don't sell anything from the page. And my recognized URL shape is *the domain my site is already on*, which is a luxury most creators don't have and don't want to acquire.

## When DIY Is The Wrong Call

I want to be careful here, because the genre of "I built X myself, you don't need SaaS" is annoying when it's read as advice. So:

- If your collaborators are going to edit the page (a partner, a manager, the friend who runs your socials), you need editorial UX more than you need control. Build it for yourself, don't recommend the build to them.
- If the page itself is part of your business (tips, lead capture, gated content, a store), you need the monetization surfaces, and re-implementing those is suddenly a real project, not a YAML file.
- If you'd actually open per-link analytics and act on them, you need the dashboard, not the GA filters you can technically build.
- If the value of `linktr.ee/yourname` to your audience is non-zero and you don't already have a domain doing the work, the recognized URL is a feature, not a tax.

The mistake is never that someone built it themselves. The mistake is recommending the build to people whose constraints aren't yours.

## The Wider Point

Once you separate the *file format* problem from the *workflow* problem, link-in-bio platforms stop being a puzzle. The file format problem, a list of typed strings rendered as buttons, is trivial. The workflow problem, someone non-technical editing, measuring, and monetizing those buttons on a URL their audience recognizes, is the entire business.

For me the workflow problem is mostly solved already. `git push`. Analytics in place. Identity on my own domain. So the file format problem is the whole problem, and the file format problem is a small YAML file.

Most SaaS, looked at honestly, is selling workflow to people for whom the workflow is the hard part. The marvel isn't that Linktree exists. The marvel is how much value sits in the gap between "a list of links" and "a list of links the right person can edit."

[^1]: Beacons has raised across multiple rounds. Their feature surface (tipping, gated content, paid DMs, paid coaching, paid courses) goes far beyond "list of links" as a description.

[^2]: "Creator monetization" is now a fairly mature category, with multiple platforms (Beacons, [Stan](https://stan.store), [Patreon](https://www.patreon.com), [Ko-fi](https://ko-fi.com)) competing for the same workflow. Link-in-bio is increasingly a wedge into that wider product.
