import Link from 'next/link';
import AgentTrace from '@/components/AgentTrace';
import ProjectCard from '@/components/ProjectCard';
import { profile, projects } from '@/data/profile';
import { getAllPosts } from '@/lib/posts';

export default function Home() {
  const featured = projects.slice(0, 2);
  const latestPosts = getAllPosts().slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="grid-hairline border-b border-line/70">
        <div className="max-w-content mx-auto px-6 md:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-mono text-xs text-amber mb-4">{'> role: ' + profile.role}</p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-paper leading-[1.1] text-glow">
              {profile.name}
            </h1>
            <p className="mt-5 text-lg text-muted leading-relaxed max-w-md">{profile.oneLiner}</p>
            <div className="mt-8 flex flex-wrap gap-3 font-mono text-sm">
              <Link href="/projects" className="bg-amber text-ink px-4 py-2 rounded-sm hover:bg-paper transition-colors">
                see the work →
              </Link>
              <a
                href={`mailto:${profile.email}`}
                className="border border-line px-4 py-2 rounded-sm text-paper hover:border-amberDim transition-colors"
              >
                get in touch
              </a>
            </div>
          </div>
          <AgentTrace />
        </div>
      </section>

      {/* Featured projects */}
      <section className="max-w-content mx-auto px-6 md:px-8 py-16 md:py-20">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-display text-2xl text-paper">
            <span className="text-amber font-mono text-sm mr-2">01</span>
            deployed systems
          </h2>
          <Link href="/projects" className="font-mono text-xs text-muted hover:text-paper transition-colors">
            all projects →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {featured.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>

      {/* Latest writing */}
      {latestPosts.length > 0 && (
        <section className="max-w-content mx-auto px-6 md:px-8 py-16 md:py-20 border-t border-line/70">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-display text-2xl text-paper">
              <span className="text-amber font-mono text-sm mr-2">02</span>
              writing
            </h2>
            <Link href="/writing" className="font-mono text-xs text-muted hover:text-paper transition-colors">
              all posts →
            </Link>
          </div>
          <ul className="divide-y divide-line/70">
            {latestPosts.map((post) => (
              <li key={post.slug}>
                <Link href={`/writing/${post.slug}`} className="flex items-center justify-between py-4 group">
                  <span className="text-paper group-hover:text-amber transition-colors">{post.title}</span>
                  <span className="font-mono text-xs text-muted">{post.date}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Contact strip */}
      <section className="max-w-content mx-auto px-6 md:px-8 py-16 md:py-20 border-t border-line/70">
        <h2 className="font-display text-2xl text-paper mb-3">
          <span className="text-amber font-mono text-sm mr-2">03</span>
          say hello
        </h2>
        <p className="text-muted max-w-lg mb-6">
          Open to collaborations on agentic systems, evals, and applied ML. The fastest way to reach me is email —
          or ask the agent above, it knows how to find me too.
        </p>
        <a href={`mailto:${profile.email}`} className="font-mono text-amber hover:underline">
          {profile.email} →
        </a>
      </section>
    </div>
  );
}
