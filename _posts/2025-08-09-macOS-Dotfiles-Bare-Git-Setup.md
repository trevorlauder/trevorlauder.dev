---
title: macOS dotfiles — bare Git repo, fast bootstrap, and reproducible dev environment
categories:
  - Blog
tags:
  - Dotfiles
  - macOS
  - Zsh
  - Homebrew
  - WezTerm
  - Git
description: How I manage my macOS development environment using a bare Git repository, a simple alias, and curated configs for Zsh, WezTerm, and more.
header:
  teaser: /assets/images/teasers/dotfiles.svg
  og_image: /assets/images/teasers/dotfiles.svg
image:
  path: /assets/images/teasers/dotfiles.svg
  width: 1200
  height: 630
---
I manage my macOS environment with a **bare Git [repository](https://github.com/trevorlauder/dotfiles)** stored at `$HOME/.dotfiles`, using my actual home directory as the working tree. The approach is minimal—no extra tooling required.

Benefits:

- No `.git` directory cluttering `$HOME`
- Standard `git` workflow via a simple alias
- Fine‑grained control over exactly which files are versioned
- New machine setup becomes a quick clone + checkout

## Core idea

Instead of cloning a standard repository directly into `~` (and dealing with a noisy untracked list), I clone it **bare** and configure Git to store objects in `.dotfiles` while treating the home directory as the working tree.

```sh
alias dotfiles="/opt/homebrew/bin/git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME"
```

The examples below assume Git was installed via Homebrew on Apple Silicon, so the binary lives at `/opt/homebrew/bin/git`.

If your path differs, adjust the path inside the alias definition.

With the alias defined, any `dotfiles <command>` behaves like a normal Git invocation—only the repository metadata stays hidden in `~/.dotfiles/`.

## Local overrides: `~/.dotfiles-local-settings`

For per‑machine or private tweaks (tokens or secrets, work vs. personal settings), keep a non‑tracked overrides file. I use `~/.dotfiles-local-settings`.

Why:

- Prevents leaking credentials or machine‑specific paths
- Lets you layer host‑specific aliases or env vars without branching
- Keeps the main tracked files portable and minimal

Make sure it is NOT tracked:

```sh
echo '.dotfiles/' >> ~/.gitignore
echo '.dotfiles-local-settings' >> ~/.gitignore
dotfiles add ~/.gitignore
dotfiles commit -m "chore: ignore local settings file" && dotfiles push
```

Source it near the end of `~/.zshrc` (after exported defaults) so it can override:

```sh
[ -f "$HOME/.dotfiles-local-settings" ] && source "$HOME/.dotfiles-local-settings"
```

## Creating the bare repo for the first time

If you are starting from scratch with dotfiles scattered through your home directory and want to publish them via a bare repository, use this one‑time sequence.

```sh
# Create the bare repo directory (do NOT use git init in $HOME)
mkdir -p $HOME/.dotfiles
git init --bare $HOME/.dotfiles

# Define the alias for the current shell (add to ~/.zshrc later)
alias dotfiles="/opt/homebrew/bin/git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME"

# Hide the giant untracked list
dotfiles config status.showUntrackedFiles no

# Stage only the files you actually want tracked (examples)
dotfiles add ~/.zshrc ~/.zshenv ~/.wezterm.lua
dotfiles commit -m "feat: initial tracked dotfiles"

# Create the remote repo on GitHub

# Point the bare repo at the new remote
dotfiles remote add origin git@github.com:trevorlauder/dotfiles.git

# Push main (create it if HEAD is still on master)
dotfiles branch -M main
dotfiles push -u origin main

# Persist the alias for future shells
echo 'alias dotfiles="/opt/homebrew/bin/git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME"' >> ~/.zshrc
```

### Adding more later
```sh
# Edit a file

# Stage just that file (example)
dotfiles add ~/.zshrc

# Commit with a clear message
dotfiles commit -m "tweak prompt colors"

# Push to sync
dotfiles push

# Batch multiple files before committing
dotfiles add ~/.zshrc ~/.wezterm.lua ~/.config/mytool/config.toml
dotfiles commit -m "update shell + wezterm + mytool"
dotfiles push
```

## Bootstrap a new Mac (existing repo)

These steps assume the bare dotfiles repo already exists remotely (i.e. you've already created it using the steps above) and you just want to configure this machine to use it.

```sh
# Clone the repo as a bare repository
git clone --bare git@github.com:trevorlauder/dotfiles.git $HOME/.dotfiles

# Add the alias for this session (skip if it's already in your ~/.zshrc)
alias dotfiles="/opt/homebrew/bin/git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME"

# Hide the giant untracked list
dotfiles config status.showUntrackedFiles no

# Check out the tracked files into $HOME
# If checkout reports existing files, move/rename them and run 'dotfiles checkout' again.
dotfiles checkout

# Persist the alias (if it isn't already there)
echo 'alias dotfiles="/opt/homebrew/bin/git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME"' >> ~/.zshrc

# (One-time) set the local main branch to track origin/main
dotfiles push --set-upstream origin main

# Pull updates in the future
dotfiles pull
```
