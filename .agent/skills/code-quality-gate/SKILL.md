---
name: code-quality-gate
description: Enforce strict linting, type-checking, and "Clean Code" principles before referencing a task as complete. Use before 'task_boundary' verification or notifying the user.
---

# Code Quality Gate Skill

## When to use this skill

- **Before** marking a task as `[x] Done`.
- **Before** notifying the user of completion.
- When the user asks to "check the code" or "verify quality".

## Workflow

1. **Static Analysis**: Run checking tools (Lint, Types, Format).
2. **Test Execution**: Run relevant unit tests.
3. **Self-Correction**: Fix simple issues (formatting, unused imports) automatically.
4. **Reporting**: Only notify user if manual intervention is needed.

## Instructions

### 1. The "Gate" Protocol

**NEVER** skip this step before finishing a coding task.

1. **Format**: `npm run format` / `black .`
2. **Lint**: `npm run lint` / `pylint`
3. **Type Check**: `npm run typecheck` / `mypy`

### 2. Fixing Issues

- **Automated Fixes**: Use `--fix` flags where possible (e.g., `eslint --fix`).
- **Manual Fixes**:
  - Resolve type errors by narrowing types, NOT by casting to `any`.
  - Resolve lint errors by refactoring, NOT by disabling the rule (unless absolutely necessary with justification).

### 3. Verification criteria

A task is NOT done until:

- [ ] No lint errors.
- [ ] No type errors.
- [ ] Tests pass (if applicable).
- [ ] Code is formatted.

## Resources

- [Clean Code Principles](https://github.com/ryanmcdermott/clean-code-javascript)
