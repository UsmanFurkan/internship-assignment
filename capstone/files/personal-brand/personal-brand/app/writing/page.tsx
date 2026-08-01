import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

export const metadata = { title: 'Writing' };

export default function WritingPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-content mx-auto px-6 md:px-8 py-16 md:py-20">
      <p className="font-mono text-xs text-amber mb-3">{'> list_posts()'}</p>
      <h1 className="font-display text-3xl text-paper mb-2">Writing</h1>
      <p className="text-muted max-w-lg mb-10">
        Notes on building and shipping ML systems — mostly things I wished someone had written down before I had
        to learn them the slow way.
      </p>

      {posts.length === 0 ? (
        <p className="font-mono text-sm text-muted">No posts yet — add markdown files to content/posts/.</p>
      ) : (
        <ul className="divide-y divide-line/70">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/writing/${post.slug}`} className="block py-6 group">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-display text-lg text-paper group-hover:text-amber transition-colors">
                    {post.title}
                  </span>
                  <span className="font-mono text-xs text-muted shrink-0">{post.date}</span>
                </div>
                {post.excerpt && <p className="text-sm text-muted mt-2 max-w-2xl">{post.excerpt}</p>}
                {post.tags?.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {post.tags.map((t) => (
                      <span key={t} className="font-mono text-[11px] text-cyan">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
