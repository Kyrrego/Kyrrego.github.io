---
layout: post
title: "How to manage private development and public releases in Git"
date: 2026-01-24
excerpt: "How I keep a detailed private commit history while publishing only clean, minimal releases to a public GitHub repository."
categories: blog
---

## Motivation

When at the review stage of a manuscript, I often need to modify the original methods and code. However, there are temporary code changes and intermediate progress that I want to keep as a work journal for myself, rather than publishing everything to the public repository that accompanies the manuscript. At the same time, I want to make sure the public repo does not contain all the mumbling commits along the way, so using multiple branches in the public repo is also out of the picture.

Here is a method to keep a mirrored private repo for my own logs, while publishing only a final, clean commit to the public repo when it's ready.

---


## Initial setup

At this point, I already had a public GitHub repository for the manuscript code, and my local `main` branch was synced with the last public commit. I then created a new private repository (`PROJECTNAME_private.git`) on GitHub, which would serve as my personal work log. Note that when creating the private repository on the Github website, it should be empty. 

Next, I added the private repository as a second remote to my existing local project, naming it to `origin` as the default push destination:

```bash
git remote add origin <private-repo-url>
```

I kept the public repository as a separate remote named `public`:

```bash
git remote add public <public-repo-url>
```

At this point, the local repository is connected to two remotes:

- **`origin`** → private repo (full history)
- **`public`** → public repo (only clean releases)

Before doing any further work, I tagged the current public commit as a reference point. This tag marks the last synchronized state between the local codebase and the public repository, and it becomes the baseline for all future releases:

```bash
git tag public-v1 public/main
git push origin --tags
```

From here on, all development happens normally on the local main branch and is pushed to the private repository. The public repository remains untouched until a clean release is ready.

## Day-to-day workflow (push to private)

Most of the time, I treat the private repo as my real workspace, e.g. 

```bash
git add -A
git commit -m "Update permutation tests in section xx"
git push origin main
```

## Publishing a clean public release

When the code is ready to be shared publicly, I create a temporary release branch and squash all changes since the last public release into a single commit.

```bash
git checkout -b release-public
git reset --soft public-v1
git commit -m "Release: update permutation tests"
git push public release-public:main
```

After the release, I tag the new public baseline:

```bash
git tag public-v2
git push origin --tags
```

Then I can switch back to my normal workflow branch:

```bash
git checkout main
```

The private history remains untouched, while the public repo gains exactly one clean commit.


## Summary
- Local branches

    - `main`: day-to-day development (frequent WIP commits)

    - `release-public`: temporary branch for packaging a clean release

- Private repo (origin)

    - receives pushes from `main`


- Public repo (public)

    - receives a single squashed commit from `release-public`

- Workflow:
  
    - Commit and push freely on `main` → private repo.
    - When ready, squash changes on `release-public` and push → public repo.
    - Use tags (`public-v1`, `public-v2`, …) to track public release points.