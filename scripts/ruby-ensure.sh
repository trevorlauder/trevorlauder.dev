#!/usr/bin/env bash
# NOTE: Avoid 'set -u' because RVM internal scripts reference unset vars (e.g., _system_name),
# which would cause aborts with nounset. We keep -e and pipefail for robustness.
set -e -o pipefail

# Ensures the Ruby version in .ruby-version is installed & active via RVM.
# Usage:
#   ruby-ensure.sh            # install if missing, select, no bundler
#   ruby-ensure.sh install-only
#   ruby-ensure.sh use        # just select (fail if missing)
#   ruby-ensure.sh bundle     # ensure, then install bundler & bundle install
#   ruby-ensure.sh gemset <name>  # ensure + create/use gemset
#
# Requirements: RVM installed & available: https://rvm.io
# This script sources RVM if standard location is detected.

MODE=${1:-ensure}
ARG2=${2:-}

if [[ ! -f .ruby-version ]]; then
  echo "ERROR: .ruby-version not found" >&2
  exit 1
fi

RUBY_VERSION=$(tr -d '\r\n\t ' < .ruby-version)
if [[ -z "$RUBY_VERSION" ]]; then
  echo "ERROR: .ruby-version empty" >&2
  exit 1
fi

# Always try to source RVM to ensure the shell function is loaded (npm scripts often spawn non-login shells)
RVM_SCRIPT="$HOME/.rvm/scripts/rvm"
if [[ -s "$RVM_SCRIPT" ]]; then
  # shellcheck disable=SC1090
  source "$RVM_SCRIPT"
fi

# If still no rvm function, but an rvm executable, adjust PATH then try sourcing profile files
if ! typeset -f rvm >/dev/null 2>&1; then
  if command -v rvm >/dev/null 2>&1; then
    : # executable exists but function not loaded
  else
    # shellcheck disable=SC2028
    echo "ERROR: RVM not found. Install via: \n  \curl -sSL https://get.rvm.io | bash -s stable" >&2
    exit 1
  fi
fi

# Repair PATH ordering (silence warnings) and opt-out of mismatch warnings
export rvm_silence_path_mismatch_check_flag=1
if [[ -d "$HOME/.rvm/bin" && ":$PATH:" != *":$HOME/.rvm/bin:"* ]]; then
  export PATH="$HOME/.rvm/bin:$PATH"
fi

# After sourcing, ensure rvm function present; if not, advise user
if ! typeset -f rvm >/dev/null 2>&1; then
  echo "WARNING: RVM shell function not loaded. Attempting fallback using executable." >&2
fi

# Normalize version string acceptable to rvm (allow forms like '3.4.1' or 'ruby-3.4.1')
if [[ ! $RUBY_VERSION =~ ^ruby- ]]; then
  RVM_VERSION="ruby-${RUBY_VERSION}"
else
  RVM_VERSION="$RUBY_VERSION"
fi

has_version() {
  rvm list strings | grep -Fx "$RVM_VERSION" >/dev/null 2>&1
}

install_version() {
  echo "Installing $RVM_VERSION ..." >&2
  if typeset -f rvm >/dev/null 2>&1; then
    rvm install "$RVM_VERSION" --binary --fuzzy
  else
    rvm install "$RVM_VERSION" || rvm install "$RVM_VERSION"
  fi
}

select_version() {
  echo "Using $RVM_VERSION" >&2
  if typeset -f rvm >/dev/null 2>&1; then
    rvm use "$RVM_VERSION" >/dev/null
  else
    # fallback attempt
    rvm "$RVM_VERSION" >/dev/null 2>&1 || true
  fi
}

ensure_version() {
  if ! has_version; then
    install_version
  fi
  select_version
}

case "$MODE" in
  install-only)
    has_version || install_version
    ;;
  use)
    if ! has_version; then
      echo "ERROR: $RVM_VERSION not installed (run npm run ruby:install)" >&2
      exit 1
    fi
    select_version
    ;;
  gemset)
    ensure_version
    if [[ -z "$ARG2" ]]; then
      echo "ERROR: gemset name required" >&2
      exit 1
    fi
    rvm gemset create "$ARG2" >/dev/null || true
    rvm use "$RVM_VERSION@$ARG2" --create >/dev/null
    echo "Now using gemset $ARG2 for $RVM_VERSION" >&2
    ;;
  bundle)
    ensure_version
    gem install bundler --conservative >/dev/null 2>&1 || true
    if [[ -f Gemfile ]]; then
      bundle install
    else
      echo "No Gemfile present; skipping bundle install" >&2
    fi
    ;;
  ensure|*)
    ensure_version
    ;;
 esac

# Show active version summary
rvm current
