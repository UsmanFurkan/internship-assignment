# Personal Brand — Website + Agent

A full-stack personal site for an AI/ML engineer, with a real agent embedded in it — and a separate daily-driver
agent for research, notes, and email drafting. Two pieces, one profile of truth.

```
personal-brand/
├── app/                  Next.js site (App Router)
│   ├── page.tsx          Home — hero with the live agent widget
│   ├── about/            Bio + skills
│   ├── projects/         Project grid
│   ├── writing/          Blog, rendered from content/posts/*.md
│   └── api/agent/        API route powering the homepage agent widget
├── components/           Nav, Footer, ProjectCard, AgentTrace (the widget)
├── data/profile.ts       ← edit this with your real info, everything reads from it
├── content/posts/        Blog posts as markdown files
├── agent/                Standalone daily agent (research / notes / email drafts)
│   ├── index.mjs
│   ├── config.json
│   └── README.md         Scheduling instructions (cron, GitHub Actions)
└── ROADMAP.md             Your AI-stack learning plan
```

## 1. Make it yours

Everything the site displays comes from **`data/profile.ts`**. Edit your name, bio, skills, links, and
projects there — the home, about, and projects pages update automatically. Add real posts as markdown files in
`content/posts/`, following the frontmatter format in the two samples already there.

## 2. Run the website

```bash
npm install
cp .env.example .env.local   # add your ANTHROPIC_API_KEY
npm run dev
```

Visit `localhost:3000`. The hero widget on the homepage is a real agent — it calls `get_profile`,
`list_projects`, and `get_project` tools against your data in `data/profile.ts` and answers visitor questions
grounded in those results, not from memory. If `ANTHROPIC_API_KEY` isn't set, the rest of the site still works;
only the widget shows a connection error.

### Deploying

The site is a standard Next.js app — deploy to **Vercel** (recommended: `vercel --prod` after
`npm install -g vercel`, or connect the repo in the Vercel dashboard) or any Node host. Set
`ANTHROPIC_API_KEY` as an environment variable on whichever platform you use.

## 3. Run the personal agent

The site widget answers questions about you. The agent in `agent/` is a separate tool that *does things for
you* on a schedule — see `agent/README.md` for setup and how to schedule it with cron or GitHub Actions.

```bash
cd agent
npm install
cp .env.example .env
npm run brief   # research configured topics, log notes, draft a digest email
```

## 4. Level up the stack

`ROADMAP.md` is a self-paced curriculum for going deeper on the systems this project touches — tool use, RAG,
evals, fine-tuning, deployment — plus a lightweight plan for turning what you build into brand content instead
of it disappearing into a private repo.

## Design notes

The visual identity is a "systems dashboard" look: ink-navy background, amber and cyan accents, monospace
headers styled like terminal output — a deliberate match for the subject (an engineer who ships agents), not a
default theme. The agent trace panel is the signature element: it's the literal mechanism of "shipping a
personal agent" made visible on the homepage, not a decorative chat bubble.
