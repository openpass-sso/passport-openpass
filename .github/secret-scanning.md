# Secret scanning

Install the Gitleaks CLI (`brew install gitleaks` on macOS), then run:

```sh
sh .github/scripts/install-secret-scan-hook.sh
```

The setup enables `.githooks` for this clone. It refuses to replace a
different hook path or existing active Git hooks; integrate
`sh .github/scripts/secret-scan.sh staged` into those hooks instead.
Existing hooks already in `.githooks` are retained.

The hook scans staged changes and fails with setup instructions if Gitleaks is
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
Gitleaks is a compensating control, not that server-side feature.
