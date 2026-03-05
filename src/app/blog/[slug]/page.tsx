import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/lib/db';
import PostControls from '@/components/PostControls';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    return { title: 'Post not found' };
  }
  return { title: post.title };
}

import CommentsSection from '@/components/CommentsSection';

export default async function PostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  return (
    <article className="prose mx-auto py-8">
      <h1>{post.title}</h1>
      <p className="text-sm text-gray-500">
        by {post.users?.username} on {new Date(post.created_at).toLocaleDateString()}
      </p>
      <div className="mt-6">
        <p>{post.content}</p>
      </div>
      <PostControls postId={post.id} authorId={post.user_id} slug={post.slug} />
      <CommentsSection postId={post.id} />
    </article>
  );
}
