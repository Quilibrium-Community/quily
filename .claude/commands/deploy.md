---
name: deploy
description: "Smart deploy: test-only (scp) when iterating, full deploy (commit+push+git pull) when confirmed working."
argument-hint: "[optional: 'test' for quick push, or commit message hint for full deploy]"
allowed-tools:
  - Bash
  - Agent
  - Read
  - Edit
  - Glob
  - Grep
---

<objective>
Smart deploy with two modes, chosen automatically based on context:

- **Test mode** — scp changed files to VPS, rebuild, restart. No commit, no GitHub push.
  Use when: actively developing/iterating, testing a fix, or the user hasn't confirmed it works yet.
- **Full mode** — commit, push to GitHub, git pull on VPS, rebuild, restart.
  Use when: changes are confirmed working, user says "deploy" after testing, or user explicitly asks to commit.

The goal is to never commit untested code. Default to test mode unless there's a clear signal to go full.
</objective>

<signals>

## How to pick the mode

**Use TEST mode when:**
- The conversation involves active development (writing code, fixing bugs, iterating)
- The user just made changes and wants to try them
- The user says "push this to test", "try this", "let's see if this works"
- $ARGUMENTS is "test", "try", "quick", or empty during an active coding session
- There are uncommitted changes AND no prior successful test in this session

**Use FULL mode when:**
- The user confirms something works: "it works", "confirmed", "looks good", "ship it"
- The user explicitly says "commit", "deploy for real", "full deploy"
- $ARGUMENTS contains a commit message hint (implies intent to commit)
- The user says "deploy" after a previous test deploy in the same session confirmed working
- The working tree is clean but there are unpushed commits (already committed, just needs push+deploy)

**When ambiguous**, ask:
> "Want me to push this to VPS for testing first, or commit and do a full deploy?"

</signals>

<process>

## 1. Sanity check

Run in parallel:
```bash
git status --short
git log @{u}.. --oneline 2>/dev/null || echo "(no upstream)"
```

If the working tree is clean AND there are no unpushed commits, report:
> "Nothing to deploy — working tree is clean and up to date with remote."
And stop.

---

## TEST MODE

### T1. Identify changed files

```bash
git diff --name-only HEAD
```

### T2. Copy changed files to VPS via scp

```bash
for file in $(git diff --name-only HEAD); do
  scp "$file" "quily-vps:/home/quily/quily-chatbot/$file"
done
```

### T3. Rebuild and restart

Only run `npm install` if package.json or lock file changed. Otherwise skip for speed.

```bash
ssh quily-vps 'cd /home/quily/quily-chatbot/bot && npm run build && pm2 restart quily-bot'
```

### T4. Report

```
Pushed to VPS for testing (not committed).

  Files: <list>
  VPS:   bot restarted
  Next:  test it, then run /deploy again to commit & ship.
```

---

## FULL MODE

### F1. Commit (if uncommitted changes)

If `git status --short` shows changes, run `/commit-all` (passing $ARGUMENTS as hint if provided).

If already clean but unpushed commits exist, skip to push.

### F2. Push to GitHub

```bash
git push
```

If push fails due to diverged history, do NOT force push. Report and stop.

### F3. Deploy to VPS

```bash
ssh quily-vps 'cd /home/quily/quily-chatbot && git pull && cd bot && npm install && npm run build && pm2 restart quily-bot'
```

### F4. Report

```
Deployed.

  Commit: <git log -1 --oneline>
  Remote: pushed
  VPS:    bot restarted
```

</process>
