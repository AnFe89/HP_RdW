---
name: planning
description: Generates comprehensive implementation plans with TDD steps. Use when you have a spec or requirements for a multi-step task, before touching code.
---

# Writing Implementation Plans

## When to use this skill

- You have a clear design or spec (e.g., from `brainstorming`)
- You are about to start a multi-step coding task
- You need to break down complex work into bite-sized units

## Workflow

### 1. Plan Structure

Create a new markdown file at `docs/plans/YYYY-MM-DD-<feature-name>.md` with this header:

```markdown
# [Feature Name] Implementation Plan

**Goal:** [One sentence describing what this builds]
**Architecture:** [2-3 sentences about approach]
**Tech Stack:** [Key technologies/libraries]

---
```

### 2. Granularity Rules

Break everything down into **bite-sized tasks** (2-5 minutes each). Each task must follow TDD principles:

1.  **Write failing test**
2.  **Verify failure**
3.  **Minimal implementation**
4.  **Verify pass**
5.  **Commit**

### 3. Task Template

Use this exact format for every task in the plan:

````markdown
### Task N: [Component/Feature Name]

**Files:**

- Create: `exact/path/to/file.py`
- Modify: `exact/path/to/existing.py:123-145`
- Test: `tests/exact/path/to/test.py`

**Step 1: Write the failing test**

```python
# Code for the test
```
````

**Step 2: Run test to verify it fails**
Run: `pytest tests/path/test.py::test_name -v`
Expected: FAIL with "function not defined"

**Step 3: Write minimal implementation**

```python
# Minimal code to pass
```

**Step 4: Run test to verify it passes**
Run: `pytest tests/path/test.py::test_name -v`
Expected: PASS

**Step 5: Commit**

```bash
git add tests/path/test.py src/path/file.py
git commit -m "feat: add specific feature"
```

```

## Instructions for the Planner

- **Audience**: Write for a skilled developer with NO context of the codebase.
- **Detail**: Include **complete code** for tests and implementation (no "add validation logic").
- **Paths**: Always use exact absolute paths or relative paths from root.
- **Philosophy**:
  - **DRY**: Don't Repeat Yourself
  - **YAGNI**: You Ain't Gonna Need It
  - **TDD**: Test Driven Development
  - **Atomic Commits**: One commit per task

## Next Steps

Once the plan is written and saved:
1.  Ask the user for review.
2.  Once approved, execute the plan step-by-step (or offer to dispatch subagents if supported).
```
