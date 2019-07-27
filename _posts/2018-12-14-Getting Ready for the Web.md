---
title: Getting Ready For The Web
---
My experience with web tools fell exponentially after high school, when computer science courses intrigued me with *'actual'* programming languages like C++ and Java, with a little Python mixed in with discrete math curriculum.

So coming into 2018 my conceptions of web tooling, and programming languages (think what we're doing with modern JS, [Node](https://nodejs.org/en/), [React](https://reactjs.org), [Bundlers](https://parceljs.org), etc), needed refreshing. All of these relatively new technologies I had previously heard a thing or two about on dev twitter, but I never really looked into any of them or how they worked. I knew I wanted to use a static page generator but I knew I'd have to come to grips with more fundamental tooling first:

{% figure caption:"Terminal with configurations" class:"shadow_image" %}
![terminal-with-configs](/assets/img/terminal-with-configs.png){:class="img-responsive"}
{% endfigure %}

[Terminal.app](https://en.wikipedia.org/wiki/Terminal_(macOS)) is Apple's terminal emulator for MacOS and is enough for what I needed: Getting Started. I've heard great things about other emulators like [iTerm2](https://iterm2.com) and [Hyper](https://hyper.is), but I feel having a solid foundation on a default terminal emu is beneficial.

Next up was the bourne again shell, or BASH (As opposed to, say, [ZSH](http://zsh.sourceforge.net), [Oh-My-ZSH](https://ohmyz.sh), etc). Because of licensing issues, MacOS ships with a slightly outdated version of Bash. I used [Homebrew](https://brew.sh) to install a more current version of Bash, and then dove into Bash specifics, commands, and configuration files. [Pat's write up](http://hypepat.com/2016/two-shells-one-prompt.html) on this helped me out a lot so instead of reinventing that wheel, I'll just link to his excellent write up. He also has some posts on Jekyll and virtualenv that helped me set up this site and get a [Flask](http://flask.pocoo.org) project started.

I learn Bash, package managers, running scripts and programs via Bash, and soon we're installing Jekyll through RubyGems and starting a new Jekyll project on the Desktop using `jekyll new`. Sweet. (I also installed [rbenv](https://github.com/rbenv/rbenv) to instal the latest Ruby build, installed the latest bundler, etc) This first couple of days was spent wrapping my head around fundamental tooling: Terminal emus, shell environments, package managers, dependencies, **Git**, text editors (I settled on [Textmate 2](https://macromates.com) for now..) Jekyll installation, setup, and Jekyll's [awesome tutorial project](https://jekyllrb.com/docs/step-by-step/01-setup/). That's really enough resources to get in the door. We're interested now. Wouldn't it be cool to build a static page site and maybe get it hosted somewhere? I hear Github Pages is doing some hosting...