---
title: Travis CI and Jekyll
---
In my previous post I wrote about Jekyll and it's integration with Github Pages, and I mentioned how Github Pages whitelists Jekyll plugins, essentially building our Jekyll site with the `--safe` mode flag. As I thought about how we might go around this, switching over to [Netlify](https://www.netlify.com) was a thought that came up that could get comments and syntax highlights going. I also realized I could just build the site locally and push my static pages over to the Github repo for my site, but seemed hacky.

A couple revealing blog posts later, enter [Travis CI](https://travis-ci.org). With Travis CI, not only can we test our Jekyll builds but we can use any dependencies or versions of Jekyll that we like! I have my Travis CI set up so that it looks for changes on my release branch, builds and tests my site from that branch, and if it passes, pushes my resulting static pages to the master branch where it is hosted on Github Pages. Then, I just created a develop branch for development. When I have something working, I push to release for testing and if it passes, on to master!

The set up really couldn't have been easier. I set up a Travis CI account by signing in with my Github credentials, and simply flipped a switch—like Drake—on my page repo to get it going. I added a `.travis.yml` file to the root to set up Travis' build configs. Before getting that started, I also had to create a personal token and set that up in Travis' settings.

```yaml
language: ruby
cache: bundler
branches:
  only:
  - release
script:
  - JEKYLL_ENV=production bundle exec jekyll build --destination site
deploy:
  provider: pages
  local-dir: ./site
  target-branch: master
  email: deploy@travis-ci.org
  name: Deployment Bot
  skip-cleanup: true
  github-token: $GITHUB_TOKEN
  keep-history: true
  on:
    branch: release
```

With this workflow, we build on a local branch of our Git repository. We can then merge these changes into a remote release branch. Travis keeps track of our release branch, builds on change, and if it passes the tests we've set up in `.travis.yml`, travis pushes the release branch to the master branch of the GitHub repository. GitHub will then serve this master branch as the site when users visit your .io site.

This is perfect for using plugins that aren't on the GitHub Pages Dependecy whitelist. It's also an ideal solutions for unit tests and the like. Travis CI has many diverse functions that will keep me busy for much time to come.