# Secret scanning

CI calls `openpass-sso/shared-public-actions/.github/workflows/secret-scan.yml@main`.
It installs checksum-verified Betterleaks 1.10.0 and scans every introduced PR,
merge-queue, and default-branch push commit, including add-then-delete secrets
and merge-resolution changes. Weekly/manual runs audit all fetched branches and
tags. A clean incremental scan does not establish that old history is clean.

The scanner policy comes from the PR/merge-group base, or otherwise the default
branch. Adding an ignore entry or scanner config in the PR being scanned cannot
suppress its own finding. CI also rejects inline `betterleaks:allow` and
`gitleaks:allow` exceptions. Revoke real credentials; request narrowly scoped
false-positive or remediated-history exceptions in a separate reviewed PR.

The shared workflow accepts an optional self-contained `config` TOML path and
`ignore-file` path (default `.betterleaksignore`). Custom configs may extend the
built-in rules with `extend.useDefault`, but `extend.path` is rejected so policy
cannot load another file from the untrusted checkout. See the [shared scanner documentation](https://github.com/openpass-sso/shared-public-actions/blob/main/.github/docs/secret-scanning.md) for range overrides and optional validation/comment inputs. CI uses a read-only token, redacts output and uploads no reports. Provider validation and inline-comment exceptions remain disabled in these callers; enabling either is an explicit caller policy change.

## Local staged checks

The root `.pre-commit-config.yaml` references Betterleaks' upstream hook at an
immutable commit for v1.10.0. Install [pre-commit](https://pre-commit.com/#install);
it builds and caches the scanner on first use, which requires network access.
Run `pre-commit install` once per clone, retaining existing checks. If a clone
already uses a different `core.hooksPath`, integrate the scanner command into
that manager instead of replacing it.

Check the current index with:

```sh
pre-commit run betterleaks --hook-stage pre-commit
```

The upstream hook scans staged changes, including partially staged files. Even
`--all-files` does not turn this staged hook into a history audit. Local policy
can differ from CI, which always reads policy from its trusted commit.

Local hooks can be bypassed and do not run for GitHub UI/API commits. CI is the
gate once the shared workflow is merged and the consumer workflow is active.
Keep reviewed scanner versions aligned; only allow narrowly scoped, verified
fixtures or false positives, never active credentials or whole repositories.
