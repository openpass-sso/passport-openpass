#!/bin/sh
set -eu

if command -v betterleaks-v1 >/dev/null 2>&1; then
  scanner=betterleaks-v1
elif command -v betterleaks >/dev/null 2>&1; then
  scanner=betterleaks
else
  echo "Betterleaks is required. Install 1.9.0 (macOS: brew install --cask betterleaks/tap/betterleaks@1) and retry." >&2
  exit 1
fi
if [ "$("$scanner" version)" != "1.9.0" ]; then
  echo "Betterleaks 1.9.0 is required; install the pinned release linked in .github/secret-scanning.md." >&2
  exit 1
fi

cd "$(git rev-parse --show-toplevel)"
case "${1:-history}" in
  staged)
    exec "$scanner" git --pre-commit --staged --no-banner --redact --verbose
    ;;
  history)
    exec "$scanner" git . --no-banner --redact --verbose --log-opts="--diff-merges=first-parent HEAD"
    ;;
  range)
    if [ "$#" -ne 3 ]; then
      echo "Usage: secret-scan.sh range BASE_SHA HEAD_SHA" >&2
      exit 2
    fi
    for sha in "$2" "$3"; do
      case "$sha" in
        ""|*[!0-9a-fA-F]*) echo "Expected a full commit SHA." >&2; exit 2 ;;
      esac
      if [ "${#sha}" -ne 40 ] && [ "${#sha}" -ne 64 ]; then
        echo "Expected a full commit SHA." >&2
        exit 2
      fi
      git cat-file -e "${sha}^{commit}"
    done
    exec "$scanner" git . --no-banner --redact --verbose --log-opts="--diff-merges=first-parent $2..$3"
    ;;
  *)
    echo "Usage: secret-scan.sh [staged|history|range BASE_SHA HEAD_SHA]" >&2
    exit 2
    ;;
esac
