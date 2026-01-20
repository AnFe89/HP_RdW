---
name: testing-master
description: Comprehensive testing strategies including Unit, Integration, and E2E ensuring code reliability. Use when writing tests, setting up CI pipelines, or ensuring quality.
---

# Testing Master Skill

## When to use this skill

- User asks to "test this feature"
- User mentions "Playwright", "Vitest", "Jest", or "React Testing Library"
- Setting up a new project's testing infrastructure
- Debugging widely reported bugs

## Workflow

1. **Unit Tests (Vitest)**: Test individual functions and hooks in isolation.
2. **Integration Tests (RTL)**: Test components ensuring they work together.
3. **E2E Tests (Playwright)**: Test critical user flows in a real browser.

## Instructions

### 1. Unit Testing (Vitest)

- **Scope**: Utilities, helpers, hooks, and complex pure functions.
- **Mocking**: Mock external dependencies (network calls, databases) to ensure speed.
- **Coverage**: Aim for high path coverage on business logic.

### 2. Integration Testing (React Testing Library)

- **Philosophy**: "The more your tests resemble the way your software is used, the more confidence they can give you."
- **Selectors**: Use `getByRole`, `getByLabelText`, `getByText` (in that order). Avoid `container.querySelector`.
- **User Events**: Use `userEvent` over `fireEvent` for realistic interactions.

### 3. E2E Testing (Playwright)

- **Critical Flows**: Login, Checkout, Onboarding.
- **Stability**: Use `await expect().toBeVisible()` to handle dynamic content.
- **Codegen**: Use `npx playwright codegen` to quickly generate test skeletons.
- **Trace Viewer**: Enable trace recording on failure for easy debugging.

## Resources

- [React Testing Library Cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Vitest Guide](https://vitest.dev/guide/)
