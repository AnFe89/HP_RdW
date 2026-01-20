---
name: project-context
description: Rapidly understand project structure, key patterns, and architecture. Use when starting a new task, "understanding the codebase", or when the user asks to "read the project".
---

# Project Context Skill

## When to use this skill

- User asks to "analyze this project"
- Starting work on a new codebase
- User asks "where is X defined?"
- Needing to understand the tech stack and architectural patterns

## Workflow

1. **Map Structure**: List root directories to identify project type (Monorepo, Next.js, Python, etc.).
2. **Read Config**: Check `package.json`, `go.mod`, `Cargo.toml`, or `requirements.txt`.
3. **Identify Key Paths**: diverse sources of truth (README, docs, architecture diagrams).
4. **Synthesize**: Create a mental map of where business logic vs. UI vs. infrastructure lives.

## Instructions

### 1. Initial Reconnaissance

Run this sequence to get the "lay of the land":

```bash
# List root files (ignore large dirs like node_modules)
ls -F
# OR if using tool:
list_dir .
```

### 2. Dependency Analysis

Read the dependency file to understand the stack:

**Node.js**:

```bash
cat package.json
```

**Python**:

```bash
cat requirements.txt
# OR
cat pyproject.toml
```

### 3. Architecture Pattern Matching

- **Next.js**: Look for `app/` or `pages/`, `next.config.js`.
- **Django**: Look for `manage.py`, `settings.py`.
- **Go**: Look for `cmd/`, `internal/`, `pkg/`.

### 4. Contextual Reading

- **ALWAYS** read `README.md` first.
- **ALWAYS** read `CONTRIBUTING.md` if present.

## Resources

- [Context Engineering Guide](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
