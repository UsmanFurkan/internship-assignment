# Personal Agent

A small CLI agent that automates three daily tasks: **research**, **notes**, and **email drafting**. It's
separate from the website so it can run on a schedule (cron, GitHub Actions, a Raspberry Pi — anywhere Node
runs) without needing the site deployed.

## What it does

- `web_search` — Anthropic's hosted search tool. No extra API key needed.
- `save_note` — appends a dated entry to `data/notes.md`.
- `list_recent_notes` — lets the agent check what it already logged, so it doesn't repeat itself.
- `draft_email` — writes a draft to `data/drafts/<timestamp>.txt`. **It never sends email on its own** — that's
  a deliberate boundary. Review drafts and send them yourself, or wire in a provider (see comment in
  `index.mjs`, `draftEmail()`).

## Setup

```bash
cd agent
npm install
cp .env.example .env   # add your ANTHROPIC_API_KEY
```

## Run it

```bash
# Daily routine: research your configured topics, log notes, draft a digest email
npm run brief

# One-off task, using the same tools
node index.mjs ask "check my notes from this week and draft a short email summarizing them"
```

Edit `config.json` to change:
- `researchTopics` — what the daily brief researches
- `maxResearchTopicsPerRun` — cap on topics per run, to control cost
- `notesFile` / `draftsDir` — where output goes

## Scheduling it

**Cron (simplest, if you have an always-on machine):**

```cron
0 7 * * * cd /path/to/personal-brand/agent && /usr/bin/node index.mjs brief >> run.log 2>&1
```

**GitHub Actions (no machine required):**

Create `.github/workflows/daily-brief.yml` in your repo:

```yaml
name: daily-brief
on:
  schedule:
    - cron: '0 7 * * *'
  workflow_dispatch: {}
jobs:
  brief:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm install
        working-directory: agent
      - run: node index.mjs brief
        working-directory: agent
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
      - uses: actions/upload-artifact@v4
        with:
          name: agent-output
          path: |
            agent/data/notes.md
            agent/data/drafts/
```

Add `ANTHROPIC_API_KEY` as a repo secret. `data/notes.md` and `data/drafts/` won't persist between Actions runs
unless you commit them back or use the artifact upload above — for a persistent log, commit `data/notes.md` at
the end of the job, or point `notesFile` at a database instead once you outgrow a flat file.

## Extending it

The agent is intentionally three tools, not thirty. To add a fourth (say, a calendar check), add its schema to
the `tools` array and a branch in `runClientTool()` — the loop in `runAgent()` handles the rest. Keep the same
rule that shaped `draft_email`: anything reversible (notes, drafts, reads) the agent can do freely; anything
with real-world side effects (sending, deleting, purchasing) should stop at a draft for you to approve, at
least until you trust it.
