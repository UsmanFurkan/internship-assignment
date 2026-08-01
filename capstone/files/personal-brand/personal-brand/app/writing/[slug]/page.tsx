import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { getAllPosts, getPostBySlug } from '@/lib/posts';

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  return { title: post?.meta.title ?? 'Post not found' };
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <article className="max-w-content mx-auto px-6 md:px-8 py-16 md:py-20">
      <div className="max-w-2xl">
        <p className="font-mono text-xs text-amber mb-3">{`> get_post(slug="${post.meta.slug}")`}</p>
        <h1 className="font-display text-3xl text-paper mb-3">{post.meta.title}</h1>
        <p className="font-mono text-xs text-muted mb-10">{post.meta.date}</p>
        <div className="prose-invert-custom">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </div>
    </article>
  );
}
