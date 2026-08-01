---
title: "Grounding agents in real tools instead of a system prompt full of facts"
date: "2026-06-14"
excerpt: "Why the chatbot on this site calls functions instead of reciting a bio, and what that buys you once the underlying data changes."
tags: ["agents", "tool-use"]
---

The easy way to build a "chat with me" widget is to paste your resume into the system prompt and let the model
paraphrase it. It works, right up until you update your resume and forget the prompt exists, or the model
quietly invents a detail that sounds plausible.

The agent on this site does it differently: it has three tools — `get_profile`, `list_projects`, and
`get_project` — that read directly from the same data file the rest of the site renders from. When a visitor
asks what I've built, the model doesn't recall an answer, it calls `list_projects` and reads the result back.

A few things fall out of that for free:

- **One source of truth.** Update `data/profile.ts` and both the static pages and the agent are correct.
- **No silent drift.** If a tool call fails, the agent says so instead of guessing.
- **A cheap eval.** Because every claim traces back to a tool result, you can script a check: does the answer
  only contain facts present in the tool output? That's a real regression test, not a vibe check.

The trace panel in the hero is the same mechanism made visible — every line you see is a real tool call, not a
scripted animation pretending to be one.
