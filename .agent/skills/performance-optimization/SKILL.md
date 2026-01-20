---
name: performance-optimization
description: Optimizes application performance focusing on Web Vitals, rendering, and bundle size. Use when the user asks to improve speed, fix slow loading, or optimize Core Web Vitals.
---

# Performance Optimization Skill

## When to use this skill

- User asks to "make the app faster"
- User mentions "Core Web Vitals" (LCP, CLS, INP)
- User complains about slow initial load or interactions
- Before a production release to ensure optimal speed

## Workflow

1. **Measure**: Identify bottlenecks using performance tools.
2. **Optimize Assets**: Compress images, fonts, and scripts.
3. **Optimize Rendering**: Fix re-renders and use streaming/suspense.
4. **Optimize Bundle**: Reduce JavaScript payload size.

## Instructions

### 1. Web Vitals Check

- **LCP (Largest Contentful Paint)**: Optimize the main hero image/element.
  - Use `next/image` with `priority` for above-the-fold images.
  - Preload critical fonts.
- **CLS (Cumulative Layout Shift)**: Stabilization.
  - Set explicit `width` and `height` for images/videos.
  - Reserve space for dynamic content (ads, banners).
- **INP (Interaction to Next Paint)**: Responsiveness.
  - Break up long tasks using `setTimeout` or `scheduler.postTask`.
  - Avoid blocking main thread with heavy JS during hydration.

### 2. React & Next.js Specifics

- **Server Components**: Move non-interactive logic to Server Components to reduce client JS.
- **Lazy Loading**: Use `next/dynamic` or `React.lazy` for heavy components below the fold.
- **Images**: Ensure `sizes` prop is used correctly in `next/image`.

### 3. Bundle Analysis

- Run `npx @next/bundle-analyzer` to visualize bundle size.
- Look for large libraries (e.g., `lodash`, `moment`) and replace with tree-shakeable alternatives.

### 4. Code Checklist

- `useMemo` / `useCallback`: Use only for expensive calculations or reference stability, not prematurely.
- `key` prop: Ensure stable and unique keys in lists to avoid unnecessary re-renders.
- Virtualization: Use `react-window` or `virtuoso` for long lists.

## Resources

- [Web Vitals Documentation](https://web.dev/vitals/)
- [Next.js Optimization Guide](https://nextjs.org/docs/app/building-your-application/optimizing)
