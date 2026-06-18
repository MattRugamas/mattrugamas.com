---
layout: post
title: "Glass, and the Machine That Built It"
date: 2026-06-10
tags:
    - website
    - ideas
---

I redesigned the site again, which is funny because the last redesign was two months ago. Developments in frontier AI models have been so interesting though, and having access to Anthropic's Fable for the short time it was available took me from testing stuff out to whoops, I redesigned the site again.

{% figure caption:"Glass, Assembling Itself" class:"shadow_image" %}
![glass-and-the-machine](/assets/img/posts/glass-and-the-machine.png){:class="img-responsive"}
{% endfigure %}

This one was different, though, in two ways. The design itself, and who did the work.

## The Glass

If you're reading this on the site, you've already seen it: the navigation is now a floating glass bar, the kind Apple has been pushing across their platforms, blurred, translucent, sitting just off the top of the page like it's hovering over the content instead of being bolted to it. It compresses slightly when you scroll. The headings are set in a serif now, Instrument Serif, with the body in Geist. The palette got quieter, the old charcoal deepened to near-black, the pink and cyan pair I'd been carrying since 2019 demoted to a single teal accent. There are faint color washes behind everything for the glass to refract.

I like it a lot. It's the first version of this site that feels designed rather than assembled.

## The Machine

What I actually wanted to write about is that I didn't build this.

I described the direction in a paragraph, pointed at a couple of sites I liked, and answered three multiple-choice questions about palette, typography, and how deep the redesign should cut. Fable, running inside [Cursor](https://cursor.com), did everything else. It read the whole codebase before touching it. It asked the right questions before starting, not filler questions, the actual decisions a designer would have walked me through. It rewrote the design token system, rebuilt the nav, reskinned every page, and then it started a local server, took screenshots of its own work at desktop and mobile widths in both themes, noticed what was off, fixed it, checked that the résumé still printed correctly on paper, and wrote the changelog entry because my project rules say the changelog stays current.

Soup to nuts, well under an hour. Including the part where it asked me what I wanted. Then I spent the next four hours reading the changes line by line, learning from the model because I wanted to understand how it worked.

I recently started working at Cursor. I now watch people use these tools all day, I debug their sessions, I see the failure modes up close. I am not an easy audience for this. And it still got me, because the thing I watched wasn't autocomplete with good marketing. It was a competent collaborator with taste, verifying its own output the way I would have, except it actually did verify, on every page, at every size, which I likely would not have[^1].

The honest version of this story isn't "I couldn't have done it myself." It's that I probably wouldn't have. I wrote a whole post about how frictionlessness is why this site survives. A full redesign, type system, palette, every page, print styles, was exactly the kind of project that likely stays in a someday pile forever. The friction didn't shrink. It evaporated.

The taste still came from me. The direction, the references, the three decisions. That division of labor, judgment from the human, execution from the machine, felt novel. In some ways it felt like more of me, not less, although that is most definitely arguable.

## The Line

Which brings me to the thing I keep turning over.

There's a version of this technology that makes us better humans. I've felt it. I published more this spring than in the previous five years. I spent the hour I didn't spend fighting implementation doing other things. The tool took the toil and left the intent, and on the other side of it was an opportunity to be more myself, kind of like the way a bicycle makes you faster without making your legs matter less.

And there's a version where we tip the other way, and the line between them is thinner than anyone is comfortable saying. It's the line between delegating the work and delegating the wanting. Between a machine that executes your taste and a machine you stop developing taste against. I felt the pull even during this redesign, a small voice saying *you don't really need to look at every screenshot, it checked already*. It was right, it had checked. That's exactly what makes the voice dangerous. Atrophy never announces itself. It just compounds quietly, decision by decision, until the judgment you'd offer isn't there to offer.

I don't think this resolves at the level of technology. It resolves at the level of habit, mine, yours, per use, and the habits are forming *now*, in the window where this still feels novel enough to notice. That's the urgency. Not the science-fiction kind. The boring kind, where the future arrives as a series of small defaults you didn't realize you were accepting. For me, it's a reminder of how much intention and critical thinking matter, in my work and in how I live, and how easily they can erode as we make things easier.

The people building these systems are saying this part out loud now. Dario's newest essay calls this decade humanity's technological adolescence, and he's blunt about the clock. We are, in his words, considerably closer to real danger in 2026 than we were in 2023[^2]. He's also written a convincing version of the upside, what it could mean if this goes well[^3]. Both essays are long. Both were insightful to me. The thing they share is the refusal to pick a lane, utopia or doom, because the honest answer is that the lane gets picked by what we all do, in aggregate, including the small stuff. Including, I'd argue, whether a guy with a Jekyll blog stays awake at the wheel while a machine redesigns it.

So, the site is glass now. A machine built it, and I mean that as a compliment to the machine and a question for myself. The question doesn't have a permanent answer. I think the best any of us can do is keep asking it, every time the tool offers to take a little more of the weight.

For now, I'm still doing the wanting. The machine can have the implementation.

[^1]: For the curious: the verification loop used a headless browser to screenshot every page at desktop and mobile widths, in dark and light mode, plus a print-to-PDF pass on the résumé to confirm the paper stylesheet survived untouched. My historical QA process was "look at it on my phone, eventually."

[^2]: Dario Amodei, ["The Adolescence of Technology"](https://www.darioamodei.com/essay/the-adolescence-of-technology) (January 2026). The framing borrows Carl Sagan's question of whether a species can survive its own technological adolescence. It's 20,000 words and earns them, and is notably the opposite of fashionable: he published it after the political winds had shifted toward full-speed-ahead.

[^3]: Dario Amodei, ["Machines of Loving Grace"](https://www.darioamodei.com/essay/machines-of-loving-grace) (October 2024). The case for what powerful AI could do for biology, mental health, development, and governance if we get the risks right. Read this one second, it lands harder with the stakes fresh.
