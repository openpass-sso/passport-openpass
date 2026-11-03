#!/bin/sh
set -eu
cd "$(git rev-parse --show-toplevel)"
if ! command -v betterleaks-v1 >/dev/null 2>&1 && ! command -v betterleaks >/dev/null 2>&1; then
  echo "Install Betterleaks first (macOS: brew install --cask betterleaks/tap/betterleaks@1)." >&2
  exit 1
fi
configured=$(git config --get core.hooksPath || true)
case "$configured" in
  .githooks|"$(pwd)/.githooks") ;;
  "")
    hooks=$(git rev-parse --git-path hooks)
    for hook in "$hooks"/*; do
      case "$hook" in *.sample) continue ;; esac
      if [ -f "$hook" ] && [ -x "$hook" ]; then
        echo "Existing Git hook found: $hook. Integrate the staged scan into it; no hooks were replaced." >&2
        exit 1
      fi
    done
    ;;
  *)
    echo "Existing core.hooksPath=$configured. Integrate the staged scan there; no hooks were replaced." >&2
    exit 1
    ;;
esac
git config --local core.hooksPath .githooks
echo "Enabled .githooks, including the Gitleaks pre-commit scan."
