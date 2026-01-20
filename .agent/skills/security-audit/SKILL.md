---
name: security-audit
description: Conducts a security audit of the codebase. Use when the user asks for a security check, audit, or vulnerability assessment.
---

# Security Audit Skill

## When to use this skill

- User asks for a security audit or check
- User mentions "vulnerabilities" or "security gaps"
- Before a major deployment to production
- When adding new sensitive features (auth, payments)

## Workflow

1. **Dependency Check**: Run audit tools to find known vulnerabilities.
2. **Static Analysis**: Scan code for security anti-patterns (hardcoded secrets, dangerous functions).
3. **Config Review**: Check security headers, CORS, and env vars.
4. **Report**: Summarize findings and recommend fixes.

## Instructions

### 1. Dependency Audit

- Run `npm audit` or `pnpm audit` to check for known vulnerabilities in dependencies.
- Check for unused dependencies that might tax the system.

### 2. Code Analysis Checklist

- **Secrets**: Search for hardcoded API keys, tokens, or passwords.
  - `grep -r "API_KEY" .` (and similar patterns)
- **Input Validation**: Ensure all user inputs are validated and sanitized (Zod, etc.).
- **Injection Flaws**: Check SQL queries and command execution for injection risks.
- **XSS**: Verify React usage (avoid `dangerouslySetInnerHTML` without sanitization).
- **Logging**: Ensure sensitive data (PII, tokens) is not logged to console/files.

### 3. Configuration & Headers

- **Headers**: Check for `Helmet` (Express) or security headers in `next.config.js`.
  - `Content-Security-Policy`
  - `X-Frame-Options`
  - `X-Content-Type-Options`
- **CORS**: Verify `Access-Control-Allow-Origin` is not `*` in production.
- **HTTPS**: Ensure cookies have `Secure` and `HttpOnly` flags.

### 4. Authentication & Authorization

- **RLS**: If using Supabase, verify Row Level Security policies are enabled and correct.
- **Middleware**: Check that protected routes strictly enforce authentication.
- **Rate Limiting**: Verify rate limiting is in place for API endpoints.

## Resources

- [OWASP Node.js Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html)
- [Node.js Security Best Practices](https://github.com/goldbergyoni/nodebestpractices)
