#!/usr/bin/env bash
set -euo pipefail

bin_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
if [[ "${1:-}" == "--plan" ]]; then
  exec node "$bin_dir/curate.cjs" weekly "$@"
fi
python3 "$bin_dir/skill-run.py" \
  --env-file "$HOME/quily-chatbot/bot/.env" \
  --env DISCORD_BOT_TOKEN -- node "$bin_dir/curate.cjs" weekly "$@"
node "$bin_dir/curate.cjs" batch
