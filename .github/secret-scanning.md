# Secret scanning

Install Betterleaks 1.9.0 (`brew install --cask betterleaks/tap/betterleaks@1` on macOS), then run:

```sh
sh .github/scripts/install-secret-scan-hook.sh
```

The setup enables `.githooks` for this clone. It refuses to replace a
different hook path or existing active Git hooks; integrate
`sh .github/scripts/secret-scan.sh staged` into those hooks instead.
Existing hooks already in `.githooks` are retained.

The hook scans staged changes and fails with setup instructions if Betterleaks is
missing. Keep existing hooks enabled. Local hooks can be bypassed and do not run
for browser edits or automated pushes.

The `secret-scan` CI job scans every introduced commit on each PR, including
documentation-only changes, and every commit in a default-branch push. This
catches a secret added and removed within the same PR. Full-history scans run
weekly and on manual dispatch. Full Git history is fetched for reliable ranges.
Merge-resolution changes are scanned too.
The scanner version and release checksum are pinned; output is redacted. CI
runs after a push, so a green merge gate does not prevent initial remote exposure.

A successful new-commit scan does not establish that existing repository history
is free of secrets.

To scan locally:

```sh
sh .github/scripts/secret-scan.sh staged
sh .github/scripts/secret-scan.sh history
```

When a real secret is found, rotate or revoke it and investigate its use. Removing
it from the latest file is insufficient because earlier commits still contain it.
Only suppress a verified test fixture or false positive with a narrowly scoped
rule and review; do not baseline real credentials or ignore entire repositories.

## Shared CI workflow

CI uses `openpass-sso/shared-public-actions/.github/workflows/secret-scan.yml@main`.
Scanner upgrades are maintained in the shared workflow; local hook versions must
be updated in each repository and installed in developer clones.

Install the pinned binary from the [1.9.0 release](https://github.com/betterleaks/betterleaks/releases/tag/v1.9.0)
if Homebrew's versioned v1 cask no longer provides 1.9.0. Homebrew installs the
`betterleaks-v1` command; release archives provide `betterleaks`. Both are supported.
The scanner requires version 1.9.0.

Credential validation against provider APIs is disabled in both hooks and CI.
Output is redacted, and the workflow does not upload scan reports.
