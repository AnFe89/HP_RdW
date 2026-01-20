---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality using Gemini 3 Pro and Nano Banana Pro. Use when the user asks to build web components, pages, artifacts, posters, or applications.
---

# Frontend Design & Implementation

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. It leverages **Gemini 3 Pro** for logic and **Nano Banana Pro** (Gemini 3 Pro Image) for visual intelligence.

## When to use this skill

- User asks to build a website, page, or component.
- User requests a "modern", "beautiful", or "distinctive" UI.
- User wants to fix or improve the aesthetics of an existing interface.
- User asks to "visualize" a design before coding.

## 1. Nano Banana Pro (Gemini 3 Pro Image) Integration

**CRITICAL**: You have access to "Nano Banana Pro" capabilities via the `generate_image` tool. You must use this for visual planning.

### When to use `generate_image`

1. **Exploration**: Before writing code for a complex page, generate a mock-up to confirm the aesthetic direction.
2. **Assets**: Generate unique backgrounds, textures, or hero images that match the design (e.g., "grainy gradients", "abstract 3D shapes").
3. **Visualization**: If the user asks "what will it look like?", show them an image first.

### Prompting "Nano Banana Pro" for UI

Nano Banana Pro excels at **Text Rendering** and **Infographic Structures**.

- **DO**: Include specific text you want in the UI in quotes (e.g., `a dashboard with title "Analytics Overview"`).
- **DO**: Use keywords like "high fidelity UI design", "infographic style", "blueprint", "schematic", "dense information density".
- **DO**: Describe the layout structure (e.g., "sidebar on left, data grid in center, dark mode").

---

## 2. Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:

- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality.

## 3. Frontend Aesthetics Guidelines

Focus on:

- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter. Pair a distinctive display font with a refined body font.
- **Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables. Dominant colors with sharp accents outperform timid palettes.
- **Motion**: Use animations for effects and micro-interactions. Focus on one well-orchestrated page load with staggered reveals.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow.
- **Backgrounds & Visual Details**: Create atmosphere and depth. Add contextual effects: gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows.

**NEVER** use generic AI-generated aesthetics like overused font families (Inter, Roboto), cliched color schemes (purple gradients), or cookie-cutter layouts.

## 4. Workflow

1. **Analyze**: Understand the requirements. Use `mcp-research` if you need to look up latest trends or libraries.
2. **Visualize**: Use `generate_image` (Nano Banana Pro) to create a visual target or assets.
    - *Example Prompt*: "High fidelity UI design of a futuristic dashboard, dark mode, neon orange accents, title text 'COMMAND CENTER', infographic style charts."
3. **Implement**: Write the code (HTML/CSS/React) to match the vision and the generated imagery.
4. **Refine**: Polish animations, spacing, and mobile responsiveness.
