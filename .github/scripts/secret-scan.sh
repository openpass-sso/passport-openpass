#!/bin/sh
set -eu

if ! command -v gitleaks >/dev/null 2>&1; then
  echo "Gitleaks is required. Install it (macOS: brew install gitleaks) and retry." >&2
  exit 1
fi

cd "$(git rev-parse --show-toplevel)"
case "${1:-history}" in
  staged)
    exec gitleaks git --pre-commit --staged --no-banner --redact --verbose
    ;;
  history)
    exec gitleaks git . --no-banner --redact --verbose --log-opts=HEAD
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
    exec gitleaks git . --no-banner --redact --verbose --log-opts="$2..$3"
    ;;
  *)
    echo "Usage: secret-scan.sh [staged|history|range BASE_SHA HEAD_SHA]" >&2
    exit 2
    ;;
esac
