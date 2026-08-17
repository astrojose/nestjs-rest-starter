---
name: conventional-commits
description: 'Standard instructions for writing, reviewing, and formatting Conventional Commits v1.0.0 in git repositories.'
---

# Conventional Commits

Follow Conventional Commits v1.0.0 format for all git commits.

## Format

```text
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Commit Types

- `feat`: new feature.
- `fix`: bug fix.
- `docs`: documentation changes only.
- `style`: formatting or missing semi-colons (no code logic change).
- `refactor`: refactoring code logic without feature additions or fixes.
- `perf`: code change that improves performance.
- `test`: adding or updating tests.
- `build`: changes affecting build system, dependencies, or pnpm.
- `ci`: CI configuration changes (`.github/workflows/ci.yml`).
- `chore`: repository maintenance tasks.

## Rules

- Keep header line under 72 characters.
- Use imperative present tense ("add feature" not "added feature").
- Do not capitalize first letter of subject.
- Do not end subject line with a period `.`.
