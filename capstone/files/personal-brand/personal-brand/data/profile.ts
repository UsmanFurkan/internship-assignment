// Edit this file with your real information. Every page on the site
// pulls from here — it's the single source of truth for your brand.

export const profile = {
  name: 'Your Name',
  role: 'AI/ML Engineer',
  oneLiner: 'I build and ship machine learning systems — from training pipelines to production agents.',
  location: 'Dhaka, Bangladesh',
  email: 'you@example.com',
  links: {
    github: 'https://github.com/yourhandle',
    linkedin: 'https://linkedin.com/in/yourhandle',
    x: 'https://x.com/yourhandle',
  },
  bio: [
    "I'm an AI/ML engineer focused on the full lifecycle of applied ML systems: data pipelines, model training and evaluation, and the infrastructure that gets models into production.",
    'Lately I spend most of my time on agentic systems — tool-using LLM agents, retrieval pipelines, and the evaluation harnesses that keep them honest.',
    "This site is also a demo: the panel above is a real agent, wired to the same profile data as this page, answering questions about my background using actual tool calls.",
  ],
  skills: [
    { group: 'Modeling', items: ['PyTorch', 'Fine-tuning (LoRA/QLoRA)', 'Evaluation & benchmarking', 'Classical ML'] },
    { group: 'Agents & LLM systems', items: ['Tool use / function calling', 'RAG pipelines', 'Vector databases', 'Prompt engineering'] },
    { group: 'Infrastructure', items: ['Docker', 'CI/CD', 'AWS / GCP', 'Serving (vLLM, Triton)'] },
    { group: 'Languages', items: ['Python', 'TypeScript', 'SQL'] },
  ],
};

export type Project = {
  slug: string;
  name: string;
  status: 'live' | 'active' | 'archived';
  summary: string;
  stack: string[];
  links?: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: 'personal-agent',
    name: 'Personal Agent',
    status: 'live',
    summary:
      'A daily-driver agent that handles research digests, note capture, and email drafting on a schedule, built with tool-use and a small evaluation harness to catch regressions.',
    stack: ['Claude API', 'Node.js', 'Tool use', 'Cron'],
    links: [{ label: 'Source', href: '#' }],
  },
  {
    slug: 'retrieval-eval-harness',
    name: 'Retrieval Eval Harness',
    status: 'active',
    summary:
      'A lightweight framework for scoring RAG pipelines on faithfulness and retrieval precision against a hand-labeled test set, used to compare chunking and embedding strategies.',
    stack: ['Python', 'pytest', 'Embeddings', 'pandas'],
    links: [{ label: 'Source', href: '#' }],
  },
  {
    slug: 'fine-tune-toolkit',
    name: 'Fine-Tune Toolkit',
    status: 'archived',
    summary:
      'A reusable LoRA fine-tuning pipeline for small open-weight models, with dataset prep, training config templates, and before/after eval reports.',
    stack: ['PyTorch', 'PEFT', 'Weights & Biases'],
    links: [{ label: 'Source', href: '#' }],
  },
];
