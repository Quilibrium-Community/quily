#!/usr/bin/env bash
# scripts/vps-archive-push.sh
# Stage, commit, and push the archives/ directory.
# Designed to run on the VPS via cron AFTER the daily bug-reports digest fires.
#
# Suggested crontab (UTC):
#   30 14 * * * /home/quily/quily-chatbot/scripts/vps-archive-push.sh >> /var/log/quily-archive-push.log 2>&1
#
# Safe to run anytime — exits clean if there is nothing new to commit.
# Only ever stages archives/, so it never touches other working-tree changes.

set -e

REPO_DIR="${QUILY_REPO_DIR:-/home/quily/quily-chatbot}"
cd "$REPO_DIR"

git add archives/

if git diff --cached --quiet; then
  exit 0
fi

DATE="$(date -u +%Y-%m-%d)"
git commit -m "archive: bug-reports digest $DATE"

if ! git push origin main; then
  echo "[archive-push] push failed for $DATE, will retry next run" >&2
fi
