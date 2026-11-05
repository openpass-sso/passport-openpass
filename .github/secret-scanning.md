# Secret scanning

CI calls `openpass-sso/shared-public-actions/.github/workflows/secret-scan.yml@main`.
The shared workflow installs checksum-verified Betterleaks 1.9.0 and scans every
introduced PR/default-branch push commit. Weekly and manual runs scan the history
reachable from HEAD. A green incremental scan does not establish that old history
is free of secrets. CI uses a read-only token; output is redacted, reports are not
uploaded, and live provider credential validation is disabled.

## Local staged checks

The root `.pre-commit-config.yaml` references Betterleaks' upstream hook at the
immutable commit for v1.9.0. `pre-commit` installs and caches the scanner; there
is no OpenPass scanner wrapper or custom hook installer. Initial environment
setup requires network access. See [pre-commit installation](https://pre-commit.com/#install).

Install `pre-commit`, then run `pre-commit install` once in each clone.
Keep any existing hooks enabled. If the clone has a custom `core.hooksPath`
(for example, Husky), integrate `pre-commit run betterleaks --hook-stage pre-commit`
into that hook manager instead of replacing its configuration.

To initialize the scanner environment and check the current index:

```sh
pre-commit run betterleaks --hook-stage pre-commit
```

This hook scans staged changes, including the staged version of partially staged
files. It does not scan full repository history, even with `--all-files`. Local
hooks can be bypassed and do not run for GitHub UI/API commits; keep CI scanning
enabled. The v1.9.0 hook redacts output and does not enable live credential
validation. Review CLI behavior when upgrading.

Update the pinned hook revision and shared CI scanner together. Only suppress
verified fixtures or false positives with narrow, reviewed exceptions; do not
baseline real credentials or ignore entire repositories.
