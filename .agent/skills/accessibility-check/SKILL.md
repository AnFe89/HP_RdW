---
name: accessibility-check
description: Ensure WCAG compliance via automated checks and manual auditing. Use when key user flows are built or user asks for accessibility audit.
---

# Accessibility Check Skill

## When to use this skill

- User asks to "check accessibility" or "a11y"
- Before launching a public-facing page
- User mentions "screen readers", "contrast", or "keyboard navigation"
- Debugging `axe-core` violations

## Workflow

1. **Automated Scan**: Run automated tools (axe) to catch ~30% of issues.
2. **Keyboard Audit**: Ensure all interactive elements are reachable and usable via keyboard.
3. **Semantic Review**: Check HTML structure (headings, landmarks, buttons vs links).
4. **Screen Reader Test**: Basic verification with a screen reader.

## Instructions

### 1. Automated Testing (Axe)

- **Library**: `axe-core` or `@axe-core/playwright`.
- **Command**: Run accessibility tests as part of your E2E suite.
  - `await injectAxe(page);`
  - `await checkA11y(page);`
- **Focus**: Zero "critical" and "serious" violations.

### 2. Manual Keyboard Audit

- **Tab Order**: Ensure logical flow (left-to-right, top-to-bottom).
- **Focus Indicators**: Ensure `:focus-visible` styles are clear and present.
- **Interactions**:
  - `Enter` / `Space` to activate buttons.
  - `Esc` to close modals.

### 3. Semantic HTML Checklist

- **Headings**: `h1` -> `h2` -> `h3` hierarchy (no skipping levels).
- **Landmarks**: `<main>`, `<nav>`, `<aside>`, `<footer>`, `<header>`.
- **Labels**:
  - All form inputs need `<label>` or `aria-label`.
  - Icons buttons need `aria-label`.
- **Images**: `alt` text for informative images, `alt=""` for decorative.

### 4. Color & Content

- **Contrast**: Text must meet WCAG AA (4.5:1 ratio).
- **Scaling**: UI shouldn't break at 200% zoom.
- **Motion**: Respect `prefers-reduced-motion`.

## Resources

- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [Axe-core Documentation](https://github.com/dequelabs/axe-core)
