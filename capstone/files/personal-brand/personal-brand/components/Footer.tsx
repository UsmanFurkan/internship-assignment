import { profile } from '@/data/profile';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line/70 mt-24">
      <div className="max-w-content mx-auto px-6 md:px-8 py-10 font-mono text-xs text-muted">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p>
            <span className="text-amber">$</span> whoami{' '}
            <span className="text-paper">{profile.name}</span> — {profile.role}, {profile.location}
          </p>
          <div className="flex gap-5">
            <a href={profile.links.github} className="hover:text-paper transition-colors">
              github
            </a>
            <a href={profile.links.linkedin} className="hover:text-paper transition-colors">
              linkedin
            </a>
            <a href={profile.links.x} className="hover:text-paper transition-colors">
              x
            </a>
            <a href={`mailto:${profile.email}`} className="hover:text-paper transition-colors">
              email
            </a>
          </div>
        </div>
        <p className="mt-4 text-muted/60">© {year} {profile.name}. Built by hand, shipped by agent.</p>
      </div>
    </footer>
  );
}
