---
name: release
description: Automated semantic versioning and GitHub release creation
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# Release Management

Fully automated versioning and GitHub release creation for Quily.

## What This Skill Does

When invoked, this skill **automatically**:
1. Analyzes commits since the last version tag
2. Determines the appropriate version bump (major/minor/patch)
3. Updates version in package.json
4. Creates git commit and tag
5. Pushes and creates a GitHub release with changelog notes
6. Reports what was done

**No user confirmation required** until the push step.

## Version Bump Rules

| Commit Type | Bump | Example |
|-------------|------|---------|
| `feat!:` or `BREAKING CHANGE` | major | Breaking change |
| `feat:` | minor | New feature |
| `fix:` | patch | Bug fix |
| `chore:` | patch | Maintenance |
| `doc:` | patch | Documentation |
| `style:` | patch | Styling |
| `refactor:` | patch | Refactoring |
| `test:` | patch | Tests |

If `` contains "major", "minor", or "patch", use that as a bump type override.

## Automated Workflow

### Step 1: Pre-flight

```bash
git status --short
git tag -l "v*.*.*" --sort=-v:refname | head -5
```

- If there are uncommitted changes → STOP. Tell the user to commit or stash first.
- If no new commits since last tag → "Nothing to release." and stop.

### Step 2: Analyze Commits

```bash
git log <LATEST_TAG>..HEAD --oneline
```

Parse conventional commit format. Highest-priority bump wins: major > minor > patch.

### Step 3: Bump Version

Edit `package.json` directly to set the new version. **That is the only file to touch.**

`package.json` is the single source of truth. `next.config.js` inlines it as
`NEXT_PUBLIC_APP_VERSION` at build time, and `src/lib/version.ts` reads it back,
so the About page follows automatically. Do **not** hand-edit `src/lib/version.ts`:
it no longer contains a version literal.

> This was not always true. Until v1.6.0 the version lived in both files, and the
> v1.5.0 release bumped only `package.json`, so the About page advertised v1.4.0
> for a whole release cycle. If you find yourself editing two files, something has
> regressed.

Use the Edit tool, not a shell one-liner. A `node -e`/`sed` rewrite of
`package.json` in bash is easy to get wrong with quoting and will corrupt the file.

**Do NOT create or update CHANGELOG.md** — we use GitHub releases instead.

### Step 4: Commit & Tag

```bash
git add package.json
git commit -m "chore(release): v<VERSION>"
git tag -a v<VERSION> -m "v<VERSION>"
```

### Step 5: Report Results

Display:
- Previous version → New version (bump type)
- Number of commits
- Summary of changes

### Step 6: Push & GitHub Release

Ask the user with AskUserQuestion:
- "Push release to remote and create GitHub release?"
- Options: "Yes, push and release" (Recommended) / "No, I'll do it later"

If yes:

```bash
git push origin HEAD --tags
```

Then create the GitHub release with grouped changelog notes:

```bash
gh release create "v<VERSION>" --title "v<VERSION>" --notes "<changelog>"
```

Generate release notes in this format (only include sections with changes):

```markdown
## Features
- Description (short-hash)

## Bug Fixes
- Description (short-hash)

## Documentation
- Description (short-hash)

## Maintenance
- Description (short-hash)
```

Write descriptions from the user's perspective. Never mention Claude, AI, or Anthropic.

## Edge Cases

- **No commits to release:** Inform user and stop.
- **Uncommitted changes:** STOP and ask user to commit first.
- **`gh` CLI not available:** Push succeeds, tell user to create release manually.
- **Tag already exists:** STOP and report.

## Files Modified

- `package.json` — version number only, and the only file that carries it
- Git commit: `chore(release): vX.Y.Z`
- Git tag: `vX.Y.Z`
- GitHub release with changelog notes

## Verifying the UI version

The About page renders the version, so it is worth confirming the bump actually
reached it rather than assuming. After `yarn build`:

```bash
grep -oE '.{40}<NEW_VERSION>.{20}' .next/server/app/about.html   # expect ["v","X.Y.Z"]
grep -c '0\.0\.0-dev' .next/server/app/about.html                # expect 0
```

React renders `<span>v{VERSION}</span>` as two adjacent text nodes, so searching
for a joined `vX.Y.Z` finds nothing even when it worked. The second check is the
one that matters: `0.0.0-dev` is the fallback in `src/lib/version.ts`, and its
presence means the build-time injection failed.

---

*Last updated: 2026-08-12*
