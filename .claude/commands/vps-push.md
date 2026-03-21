---
name: vps-push
description: "Quick-deploy to VPS without committing — copies changed files via scp for rapid testing. No commit, no GitHub push."
allowed-tools:
  - Bash
---

<objective>
Deploy current working tree (including uncommitted changes) to the VPS for testing.
No commit, no GitHub push. Use this during active development to test changes fast.
Run /deploy when the fix is confirmed working to do a full commit → push → deploy.
</objective>

<process>

## 1. Identify changed files

```bash
cd d:\GitHub\Quilibrium\quily-chatbot
git diff --name-only HEAD
```

If no changes, report "Nothing to push — working tree matches HEAD." and stop.

## 2. Copy changed files to VPS

For each changed file, use `scp` to copy it to the corresponding path on the VPS:

```bash
for file in $(git diff --name-only HEAD); do
  scp "$file" "quily-vps:/home/quily/quily-chatbot/$file"
done
```

Show which files were copied.

## 3. Rebuild and restart on VPS

```bash
ssh quily-vps 'cd /home/quily/quily-chatbot/bot && npm run build && pm2 restart quily-bot'
```

Only run `npm install` if package.json or package-lock.json changed. Otherwise skip it for speed.

Show the full output. If the command exits non-zero, report the error clearly.

## 4. Report

```
VPS synced (uncommitted).

  Files pushed: <list of files>
  Status: bot restarted
  Note:   changes are NOT committed or pushed to GitHub.
  Next:   run /deploy when confirmed working.
```

</process>
