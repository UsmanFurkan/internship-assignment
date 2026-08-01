# Master the AI Stack

A self-paced curriculum for an AI/ML engineer building a public track record. Structured in five phases, each
with: what to learn, what to *ship* to prove it, and what to *publish* about it. The shipping and publishing
are not optional add-ons — they're how the learning turns into a brand instead of a pile of private notebooks.

Pace guide: treat each phase as 2-4 weeks of consistent part-time work, not a race. Don't start Phase 2 until
Phase 1 has a shipped artifact and a published post, even a short one — momentum comes from finishing loops,
not from stacking up half-read material.

---

## Phase 1 — LLM foundations & prompt engineering

**Learn**
- How transformer-based LLMs generate text: tokens, context windows, sampling (temperature, top-p)
- Prompt engineering: few-shot examples, chain-of-thought, system vs. user prompts, structured output (JSON mode)
- The current model landscape and how to evaluate which model fits a task (cost, latency, context, capability)
- API mechanics: the Anthropic Messages API, streaming, token accounting

**Ship**
- A small CLI or script that solves one real problem for you (summarizer, classifier, data extractor) using
  the Claude API directly — no framework.

**Publish**
- A short post: "the prompt that didn't work, and the one that did" — a before/after with the actual prompts.

---

## Phase 2 — Tool use & agents

**Learn**
- Function calling / tool use: schemas, the tool-result loop, multi-turn tool orchestration
- Agent design patterns: ReAct-style loops, planning vs. reactive agents, when *not* to use an agent
- Guardrails: what to let an agent do autonomously vs. what needs a human checkpoint

**Ship**
- This is where the **personal agent** in `agent/` and the **agent widget** on your site fit. If you've set
  those up, you've already shipped this phase — extend them: add a fourth tool, add a second data source, add
  a lightweight eval that checks the agent's answers stay grounded in tool output.

**Publish**
- Write up the tool-boundary decision you made (which actions the agent can do freely vs. which stop at a
  draft) — this is a genuinely useful post because most agent tutorials skip it.

---

## Phase 3 — Retrieval & RAG

**Learn**
- Embeddings and vector similarity; chunking strategies and why they matter more than the vector DB you pick
- Vector databases (pick one — pgvector, Chroma, or a managed option — and go deep rather than surveying five)
- RAG failure modes: retrieval precision vs. recall, context poisoning, stale indexes

**Ship**
- A RAG pipeline over a real corpus you care about (your own notes, a docs site, a set of papers) with a small
  labeled eval set — 20-30 question/answer pairs you can score retrieval and answer quality against.

**Publish**
- Share the eval numbers, not just the demo. "Here's what changed when I switched chunking strategy" is a far
  more credible post than a screenshot of a chat window.

---

## Phase 4 — Fine-tuning & evaluation

**Learn**
- When fine-tuning beats prompting (and when it doesn't — this is most of the time)
- LoRA/QLoRA for parameter-efficient fine-tuning on open-weight models
- Building evaluation harnesses: golden datasets, automated scoring, human-in-the-loop review, regression
  tracking across model/prompt versions

**Ship**
- A fine-tuning run on a small open-weight model for a narrow task, with a before/after eval report — even a
  modest quality bump, clearly measured, is a stronger artifact than an ambitious one you can't quantify.

**Publish**
- The eval report itself, lightly narrated. This is the post that signals "engineer" rather than "enthusiast"
  to anyone technical reading your site.

---

## Phase 5 — Production & MLOps

**Learn**
- Serving: batching, quantization, latency/cost tradeoffs, vLLM or similar for self-hosted inference
- Observability: logging prompts/responses, tracing tool calls, catching silent regressions
- CI/CD for ML systems: what "tests" mean when the output is probabilistic
- Cost management at scale: caching, model routing (cheap model first, escalate when needed)

**Ship**
- Take one earlier project (the RAG pipeline or the agent) and actually deploy it with monitoring — logs you'd
  notice a regression in, not just a working demo.

**Publish**
- "What broke in production that didn't break in my notebook" — this genre of post consistently outperforms
  polished tutorials because it's information people can't get anywhere else.

---

## Running the brand loop

Each phase follows the same loop: **learn → ship → publish → link back**. After every post, add the project to
`data/profile.ts` so it shows up on your site, and mention it once, briefly, wherever your professional network
already is (LinkedIn, X, a relevant Slack/Discord) — not a launch campaign, just a pointer. Consistency across
five phases beats intensity in one; the goal is a site that, a year from now, is a legible record of real
things you built, in the order you actually learned them.
