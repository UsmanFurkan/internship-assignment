#!/usr/bin/env node
// Personal agent — automates daily research, note-taking, and email drafting.
//
// Usage:
//   node index.mjs brief            Run the daily research + notes + email-draft routine
//   node index.mjs ask "<task>"     Give the agent a one-off task using the same tools
//
// Requires ANTHROPIC_API_KEY in the environment (or a .env file next to this script).

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Anthropic from '@anthropic-ai/sdk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf-8'));

const NOTES_PATH = path.join(__dirname, config.notesFile);
const DRAFTS_DIR = path.join(__dirname, config.draftsDir);
const MODEL = 'claude-sonnet-5';

fs.mkdirSync(path.dirname(NOTES_PATH), { recursive: true });
fs.mkdirSync(DRAFTS_DIR, { recursive: true });
if (!fs.existsSync(NOTES_PATH)) fs.writeFileSync(NOTES_PATH, `# Notes\n\n`);

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ---- Tools -----------------------------------------------------------

const tools = [
  // Server-side tool: Anthropic runs the search and returns results inline,
  // no local execution needed.
  { type: 'web_search_20250305', name: 'web_search', max_uses: 5 },
  {
    name: 'save_note',
    description: 'Append a dated note to the running notes log. Use for research takeaways, ideas, or reminders.',
    input_schema: {
      type: 'object',
      properties: {
        heading: { type: 'string', description: 'Short title for this note' },
        body: { type: 'string', description: 'The note content, 1-4 sentences' },
      },
      required: ['heading', 'body'],
    },
  },
  {
    name: 'list_recent_notes',
    description: 'Read the most recent notes from the log, to avoid duplicating research already captured.',
    input_schema: {
      type: 'object',
      properties: { limit: { type: 'integer', description: 'Number of recent notes to return', default: 10 } },
      required: [],
    },
  },
  {
    name: 'draft_email',
    description:
      'Save an email draft to disk for human review. This does NOT send email — it only writes a draft file.',
    input_schema: {
      type: 'object',
      properties: {
        subject: { type: 'string' },
        body: { type: 'string' },
      },
      required: ['subject', 'body'],
    },
  },
];

function saveNote({ heading, body }) {
  const date = new Date().toISOString().slice(0, 10);
  const entry = `\n## ${date} — ${heading}\n${body}\n`;
  fs.appendFileSync(NOTES_PATH, entry);
  return `saved note "${heading}"`;
}

function listRecentNotes({ limit = 10 } = {}) {
  const raw = fs.readFileSync(NOTES_PATH, 'utf-8');
  const entries = raw.split(/\n(?=## )/).filter((e) => e.trim().startsWith('##'));
  return entries.slice(-limit).join('\n---\n') || '(no notes yet)';
}

function draftEmail({ subject, body }) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const file = path.join(DRAFTS_DIR, `${stamp}.txt`);
  fs.writeFileSync(file, `Subject: ${subject}\n\n${body}\n`);
  // To actually send instead of draft, wire in your email provider here, e.g.:
  //   import { Resend } from 'resend';
  //   await new Resend(process.env.RESEND_API_KEY).emails.send({ to, subject, text: body });
  return `draft saved to ${path.relative(__dirname, file)} (not sent — review and send manually, or wire up an email provider)`;
}

function runClientTool(name, input) {
  if (name === 'save_note') return saveNote(input);
  if (name === 'list_recent_notes') return listRecentNotes(input);
  if (name === 'draft_email') return draftEmail(input);
  return `unknown tool: ${name}`;
}

// ---- Agent loop --------------------------------------------------------

async function runAgent(systemPrompt, userPrompt, { maxTurns = 10 } = {}) {
  const messages = [{ role: 'user', content: userPrompt }];

  for (let turn = 0; turn < maxTurns; turn++) {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1500,
      system: systemPrompt,
      tools,
      messages,
    });

    const clientToolUses = response.content.filter(
      (b) => b.type === 'tool_use' && tools.some((t) => t.name === b.name && !t.type)
    );
    const textBlocks = response.content.filter((b) => b.type === 'text');

    for (const block of response.content) {
      if (block.type === 'server_tool_use' && block.name === 'web_search') {
        console.log(`  [web_search] "${block.input.query}"`);
      }
      if (block.type === 'tool_use') {
        console.log(`  [tool_use] ${block.name}(${JSON.stringify(block.input)})`);
      }
    }

    if (clientToolUses.length === 0) {
      const finalText = textBlocks.map((b) => b.text).join('\n').trim();
      if (finalText) console.log('\n' + finalText + '\n');
      if (response.stop_reason !== 'tool_use') return finalText;
    }

    messages.push({ role: 'assistant', content: response.content });

    if (clientToolUses.length > 0) {
      const toolResults = clientToolUses.map((use) => ({
        type: 'tool_result',
        tool_use_id: use.id,
        content: String(runClientTool(use.name, use.input)),
      }));
      messages.push({ role: 'user', content: toolResults });
    } else if (response.stop_reason !== 'tool_use') {
      break;
    }
  }
}

// ---- Modes ---------------------------------------------------------------

async function brief() {
  const topics = config.researchTopics.slice(0, config.maxResearchTopicsPerRun);
  console.log(`Running daily brief for ${config.ownerName} — ${topics.length} topics\n`);

  const systemPrompt = `You are ${config.ownerName}'s daily research agent. For each topic given, search the
web, then call save_note with a concise, specific heading and 2-3 sentence body capturing what's actually new
or useful — skip anything generic. Check list_recent_notes first if unsure whether a topic was already covered
recently. After all topics are researched, call draft_email once with a short digest (subject + a few bullet
points, one per topic) summarizing today's findings for ${config.ownerName} to skim.`;

  const userPrompt = `Research these topics and log notes, then draft today's digest email:\n${topics
    .map((t, i) => `${i + 1}. ${t}`)
    .join('\n')}`;

  await runAgent(systemPrompt, userPrompt, { maxTurns: topics.length * 3 + 4 });
  console.log(`Done. Notes: ${path.relative(process.cwd(), NOTES_PATH)} | Drafts: ${path.relative(process.cwd(), DRAFTS_DIR)}`);
}

async function ask(task) {
  const systemPrompt = `You are ${config.ownerName}'s personal agent. You can search the web, save notes, list
recent notes, and draft (never send) emails. Use tools as needed to complete the task, then summarize what you
did.`;
  await runAgent(systemPrompt, task, { maxTurns: 10 });
}

// ---- Entry point -----------------------------------------------------------

const [, , mode, ...rest] = process.argv;

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('Missing ANTHROPIC_API_KEY. Set it in your environment or in agent/.env');
  process.exit(1);
}

if (mode === 'brief') {
  await brief();
} else if (mode === 'ask') {
  const task = rest.join(' ');
  if (!task) {
    console.error('Usage: node index.mjs ask "<task>"');
    process.exit(1);
  }
  await ask(task);
} else {
  console.error('Usage:\n  node index.mjs brief\n  node index.mjs ask "<task>"');
  process.exit(1);
}
