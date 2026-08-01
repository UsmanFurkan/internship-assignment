import Link from 'next/link';
import { profile } from '@/data/profile';

const links = [
  { href: '/', label: 'index' },
  { href: '/about', label: 'about' },
  { href: '/projects', label: 'projects' },
  { href: '/writing', label: 'writing' },
];

export default function Nav() {
  return (
    <header className="border-b border-line/70">
      <div className="max-w-content mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="font-mono text-sm text-paper hover:text-amber transition-colors">
          <span className="text-amber">~/</span>
          {profile.name.toLowerCase().replace(/\s+/g, '-')}
        </Link>
        <nav className="flex items-center gap-6 font-mono text-sm text-muted">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-paper transition-colors">
              {l.label}
            </Link>
          ))}
          <a
            href={`mailto:${profile.email}`}
            className="text-ink bg-amber px-3 py-1.5 rounded-sm hover:bg-paper transition-colors"
          >
            contact
          </a>
        </nav>
      </div>
    </header>
  );
}
