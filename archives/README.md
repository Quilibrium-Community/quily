# Archives

Operational output from the Quily bot, archived for long-term reference.

**Not ingested into the RAG knowledge base.** Anything under `docs/` is auto-ingested by `scripts/ingest/`. This directory sits outside that scope on purpose.

## Subdirectories

- `quorum-bug-reports/YYYY-MM-DD.md` — daily triaged digest of the `#quorum-bug-reports` Discord channel.

## How it gets here

The bot writes archive files on the VPS after posting each daily digest. The `scripts/vps-archive-push.sh` cron job (14:30 UTC) commits and pushes the directory to GitHub.
