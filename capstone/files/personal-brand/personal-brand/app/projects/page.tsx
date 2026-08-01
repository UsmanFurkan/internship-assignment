import ProjectCard from '@/components/ProjectCard';
import { projects } from '@/data/profile';

export const metadata = { title: 'Projects' };

export default function ProjectsPage() {
  return (
    <div className="max-w-content mx-auto px-6 md:px-8 py-16 md:py-20">
      <p className="font-mono text-xs text-amber mb-3">{'> list_projects(status="all")'}</p>
      <h1 className="font-display text-3xl text-paper mb-2">Projects</h1>
      <p className="text-muted max-w-lg mb-10">
        Systems I've built and shipped, from live agents to research tooling. Status reflects what's actually
        running today, not what's finished.
      </p>
      <div className="grid md:grid-cols-2 gap-5">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </div>
  );
}
