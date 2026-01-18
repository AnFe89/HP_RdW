---
name: brainstorming
description: Facilitates creative work and design exploration. Use this before creating features, building components, or modifying behavior to explore user intent and requirements.
---

# Brainstorming Ideas Into Designs

## When to use this skill

- Before starting any new feature or component
- When requirements are vague or high-level
- To turn an idea into a concrete design spec
- Use PRIOR to the `planning` skill

## Workflow

### 1. Understanding the Idea

- [ ] **Check context**: Review current project state (files, docs, recent commits)
- [ ] **Refine understanding**: Ask questions **one at a time**
  - Prefer multiple-choice questions
  - Only one question per message
  - Focus on purpose, constraints, and success criteria

### 2. Exploring Approaches

- [ ] **Propose alternatives**: Offer 2-3 different approaches with trade-offs
- [ ] **Recommend**: Lead with your recommended option and explain why
- [ ] **Converge**: Agree on a single direction before detailed design

### 3. Presenting the Design

- [ ] **Incremental validation**: Break design into small sections (200-300 words)
- [ ] **Check-in**: Ask "Does this look right so far?" after each section
- [ ] **Cover key areas**:
  - Architecture
  - Components
  - Data flow
  - Error handling
  - Testing

### 4. Output & Transition

- [ ] **Document**: Write the validated design to `docs/plans/YYYY-MM-DD-<topic>-design.md`
- [ ] **Commit**: Save the design document to git
- [ ] **Transition**: Ask "Ready to set up for implementation?"
- [ ] **Next Step**: Trigger the `planning` skill to create the implementation plan

## Core Principles

- **One question at a time**: Don't overwhelm the user.
- **Multiple choice preferred**: Reduce cognitive load.
- **YAGNI ruthlessly**: Remove unnecessary features during design.
- **Explore alternatives**: Always 2-3 options before settling.
- **Incremental validation**: Confirm alignment frequently.
