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

The initial full-history inventory is retained for review. Historical findings
need classification and remediation; a green new-commit scan does not certify
that old history is clean. No historical credentials are suppressed by this gate.

To scan locally:

```sh
sh .github/scripts/secret-scan.sh staged
sh .github/scripts/secret-scan.sh history
```

When a real secret is found, rotate or revoke it and investigate its use. Removing
it from the latest file is insufficient because earlier commits still contain it.
Review historical findings before making this job required. Only suppress a
verified test fixture or false positive with a narrowly scoped rule and review;
do not baseline real credentials or ignore entire repositories.

This check supplements the existing build/test checks. GitHub's native push
protection remains unavailable for unlicensed private/internal repositories;
Betterleaks is a compensating control, not that server-side feature.

## Shared CI workflow

CI calls `openpass-sso/shared-public-actions/.github/workflows/secret-scan.yml@main`,
following the shared scanning workflow pattern in openpass-webtv-demo. OpenPass
manages that repository and permits its `main` ref. Third-party Action pins are
unchanged. CI scanner upgrades are maintained centrally; local hook upgrades must
still be rolled out to each clone. The shared workflow uses Betterleaks 1.9.0 and
verifies its release archive checksum.

Install the pinned binary from the [1.9.0 release](https://github.com/betterleaks/betterleaks/releases/tag/v1.9.0)
if Homebrew's versioned v1 cask no longer provides 1.9.0. Homebrew installs the
`betterleaks-v1` command; release archives provide `betterleaks`. Both are supported.
The version check deliberately rejects the incompatible v2 CLI.

Credential validation against provider APIs is disabled in both hooks and CI;
findings are not discarded simply because liveness cannot be verified. No raw
credentials are written to logs or uploaded as artifacts by this workflow.

Merge the shared workflow PR first, then rerun consumer PR checks. Calling a
workflow absent from the shared repository's `main` branch fails until that merge.
Before making scanning required, verify the exact nested check name and GitHub
Actions App on the merged implementation; it may differ from the old standalone
`secret-scan` check.
