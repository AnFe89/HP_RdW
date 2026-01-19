---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, or applications. Generates creative, polished code that avoids generic AI aesthetics.
license: Complete terms in LICENSE.txt
---

# Frontend Design

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

## When to use this skill

- User asks to build web components, pages, or applications
- User requests UI/UX design or improvements
- User wants "creative", "polished", or "high-quality" frontend code
- User specifically asks to avoid generic or "AI-looking" designs

## Workflow

### 1. Design Thinking (Mental Step)

Before coding, mentally commit to a BOLD aesthetic direction:

- **Purpose**: What problem does this solve?
- **Tone**: Pick an extreme (e.g., brutally minimal, maximalist chaos, retro-futuristic, luxury/refined).
- **Differentiation**: What makes this UNFORGETTABLE?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision.

### 2. Aesthetic Guidelines

Implement working code that adheres to these principles:

- **Typography**: beautiful, unique, and interesting fonts. No generic choices (Inter, Arial). Pair distinctive display fonts with refined body fonts.
- **Color & Theme**: Cohesive, dominant colors with sharp accents. Avoid timid, evenly-distributed palettes.
- **Motion**: High-impact staggered reveals, scroll-triggering, and hover states. CSS-only where possible, Framer Motion for React.
- **Spatial Composition**: Asymmetry, overlap, diagonal flow, grid-breaking elements.
- **Backgrounds**: Atmosphere and depth via gradients, noise, patterns, shadows, or layered transparencies.
- **Visual Assets (Nano Banana Pro)**: Use the `generate_image` tool to create unique, high-quality images that match the aesthetic. **Never use placeholders.** Use Nano Banana Pro (via image generation) to "spice up" the design with distinctive visuals.

### 3. Implementation

- **Production-grade**: Functional and bug-free.
- **Cohesive**: Every element supports the chosen aesthetic.
- **Meticulous**: Strict attention to spacing and micro-interactions.

## Output Rules

- **Match Complexity**: Maximalist designs get elaborate code/animations; Minimalist designs get strict restraint.
- **Vary Choices**: Never use the same aesthetic twice. Switch between light/dark, different fonts, and different vibes.
- **NO GENERIC AI AESTHETICS**:
  - No overused fonts (Space Grotesk, Roboto)
  - No purple gradients on white backgrounds
  - No cookie-cutter layouts

## Resources

- **scripts/generate-palette**: (Optional) Helper to generate cohesive color themes.
