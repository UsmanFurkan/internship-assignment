import type { Project } from '@/data/profile';

const statusColor: Record<Project['status'], string> = {
  live: 'bg-live',
  active: 'bg-amber',
  archived: 'bg-muted',
};

const statusLabel: Record<Project['status'], string> = {
  live: 'live',
  active: 'in progress',
  archived: 'archived',
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="border border-line rounded-md p-6 bg-panel/60 hover:border-amberDim transition-colors">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-lg text-paper">{project.name}</h3>
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted">
          <span className={`h-1.5 w-1.5 rounded-full ${statusColor[project.status]}`} />
          {statusLabel[project.status]}
        </span>
      </div>
      <p className="text-sm text-muted leading-relaxed mb-4">{project.summary}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {project.stack.map((s) => (
          <span key={s} className="font-mono text-[11px] text-cyan border border-cyan/30 rounded-sm px-2 py-0.5">
            {s}
          </span>
        ))}
      </div>
      {project.links && (
        <div className="flex gap-4 font-mono text-xs">
          {project.links.map((l) => (
            <a key={l.label} href={l.href} className="text-amber hover:underline">
              {l.label} →
            </a>
          ))}
        </div>
      )}
    </article>
  );
}
