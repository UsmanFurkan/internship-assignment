---
title: "What my daily agent actually does (and where I still don't trust it)"
date: "2026-05-02"
excerpt: "A walkthrough of the cron job that runs research, drafts an email digest, and files notes every morning before I'm awake."
tags: ["agents", "automation"]
---

Every morning at 7am a small Node script wakes up, reads a list of topics I care about, and does three things:
runs web research on each one, writes a short note to a running markdown log, and drafts a digest email it
never sends on its own.

That last part is deliberate. Research and note-taking are low-stakes if the agent gets something wrong — I'll
catch it next time I read the log. Sending email on my behalf is not low-stakes, so the agent stops at a draft
sitting in a folder, and I'm the one who decides whether it goes out.

The tool boundary matters more than the model choice here. `save_note` just appends to a file — cheap to
undo, cheap to audit. `draft_email` writes to disk instead of calling an SMTP API. The riskiest action in the
whole pipeline is the one action the agent is not allowed to complete by itself.

If you're building something similar, I'd start by listing your tools out and asking, for each one: what's the
blast radius if this is wrong three days in a row before I notice? That question tells you which tools need a
human in the loop and which ones don't.
