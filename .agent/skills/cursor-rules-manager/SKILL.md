---
name: cursor-rules-manager
description: Read, interpret, and enforce project-specific rules defined in .cursorrules or .cursor/rules. Use at the start of every session to align with user preferences.
---

# Cursor Rules Manager Skill

## When to use this skill

- **ALWAYS** at the beginning of a session (if not auto-loaded).
- When the user mentions "rules", "instructions", or "preferences".
- To check for project-specific coding standards (naming conventions, banned libraries).

## Workflow

1. **Locate Rules**: Check for `.cursorrules` in root, or files in `.cursor/rules/`.
2. **Read & Ingest**: Read the content of these files.
3. **Active Enforcement**: Treat these rules as *system prompts*. Validates every code change against them.

## Instructions

### 1. locating Rules files

```bash
# Check for standard locations
ls -F .cursorrules .cursor/rules/ 2>/dev/null
```

### 2. Hierarchy of Rules

1. **User Prompt**: Highest priority (overrides everything).
2. **`.cursorrules`**: Project-specific strict rules.
3. **Agent Default**: Fallback best practices.

### 3. Common Rules Parsing

- **"Pseudo-XML"**: Many users use XML-like tags (e.g., `<coding_standards>`). Parse these sections distinctively.
- **Negative Constraints**: Pay special attention to "NEVER" or "DO NOT" instructions.

### 4. Enforcement Strategy

Before writing code:

- "Does this change violate any rule in `.cursorrules`?"
- *Example*: If rule says "Use strict Typescript", do not use `any`.

## Resources

- [Awesome Cursor Rules](https://github.com/PatrickJS/awesome-cursorrules)
