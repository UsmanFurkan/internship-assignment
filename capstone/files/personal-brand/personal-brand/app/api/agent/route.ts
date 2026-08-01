import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { profile, projects } from '@/data/profile';

export const runtime = 'nodejs';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MODEL = 'claude-sonnet-5';

const tools: Anthropic.Tool[] = [
  {
    name: 'get_profile',
    description: 'Get bio, skills, location, and contact info for the site owner.',
    input_schema: {
      type: 'object',
      properties: {
        section: {
          type: 'string',
          enum: ['bio', 'skills', 'contact', 'all'],
          description: 'Which part of the profile to fetch.',
        },
      },
      required: ['section'],
    },
  },
  {
    name: 'list_projects',
    description: 'List the site owner\'s projects, optionally filtered by status.',
    input_schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['live', 'active', 'archived', 'all'],
        },
      },
      required: ['status'],
    },
  },
  {
    name: 'get_project',
    description: 'Get full detail on a single project by slug.',
    input_schema: {
      type: 'object',
      properties: {
        slug: { type: 'string' },
      },
      required: ['slug'],
    },
  },
];

function runTool(name: string, input: any): string {
  if (name === 'get_profile') {
    if (input.section === 'bio') return JSON.stringify({ bio: profile.bio });
    if (input.section === 'skills') return JSON.stringify({ skills: profile.skills });
    if (input.section === 'contact')
      return JSON.stringify({ email: profile.email, links: profile.links, location: profile.location });
    return JSON.stringify(profile);
  }
  if (name === 'list_projects') {
    const list = input.status && input.status !== 'all' ? projects.filter((p) => p.status === input.status) : projects;
    return JSON.stringify(list.map(({ slug, name, status, summary, stack }) => ({ slug, name, status, summary, stack })));
  }
  if (name === 'get_project') {
    const p = projects.find((p) => p.slug === input.slug);
    return p ? JSON.stringify(p) : JSON.stringify({ error: 'not found' });
  }
  return JSON.stringify({ error: 'unknown tool' });
}

const SYSTEM_PROMPT = `You are the personal agent embedded on ${profile.name}'s website. You answer visitor
questions about ${profile.name} (${profile.role}) using ONLY the tools provided — never invent facts.
Always call at least one tool before answering. Keep answers to 2-4 sentences, direct and specific,
written in first person as if you were briefing a visitor on ${profile.name}'s behalf. If asked something
the tools can't answer, say so plainly and point the visitor to the contact link.`;

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured on the server' }, { status: 500 });
  }

  const { question } = await req.json();
  if (!question || typeof question !== 'string') {
    return NextResponse.json({ error: 'question is required' }, { status: 400 });
  }

  const messages: Anthropic.MessageParam[] = [{ role: 'user', content: question }];
  const toolCalls: string[] = [];
  let finalAnswer = '';

  for (let turn = 0; turn < 4; turn++) {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 600,
      system: SYSTEM_PROMPT,
      tools,
      messages,
    });

    const toolUses = response.content.filter((b): b is Anthropic.ToolUseBlock => b.type === 'tool_use');
    const textBlocks = response.content.filter((b): b is Anthropic.TextBlock => b.type === 'text');

    if (toolUses.length === 0) {
      finalAnswer = textBlocks.map((b) => b.text).join('\n').trim();
      break;
    }

    messages.push({ role: 'assistant', content: response.content });

    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const use of toolUses) {
      toolCalls.push(`${use.name}(${JSON.stringify(use.input)})`);
      const result = runTool(use.name, use.input as any);
      toolResults.push({ type: 'tool_result', tool_use_id: use.id, content: result });
    }
    messages.push({ role: 'user', content: toolResults });

    if (response.stop_reason !== 'tool_use') {
      finalAnswer = textBlocks.map((b) => b.text).join('\n').trim();
      break;
    }
  }

  if (!finalAnswer) {
    finalAnswer = `I wasn't able to pull a grounded answer for that — try asking about ${profile.name}'s projects, skills, or how to get in touch.`;
  }

  return NextResponse.json({ answer: finalAnswer, toolCalls });
}
