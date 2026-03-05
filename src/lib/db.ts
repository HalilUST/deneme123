import { supabase, createBrowserClient } from './supabase';
import type { Database } from './types';

// you can generate types with supabase-cli or manually define minimal ones

export async function getUserByUsername(username: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error) {
    console.error('getUserByUsername error', error);
    throw error;
  }
  return data;
}

export async function getPostsByUser(userId: string) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getPostsByUser error', error);
    throw error;
  }
  return data;
}

export async function getFeed(userId: string, limit = 20, offset = 0) {
  // first fetch list of following_ids
  const { data: follows, error: followError } = await supabase
    .from('follows')
    .select('following_id')
    .eq('follower_id', userId);

  if (followError) {
    console.error('getFeed follow query error', followError);
    throw followError;
  }

  const ids = follows?.map((f: any) => f.following_id) || [];
  if (ids.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from('posts')
    .select('*, users(username)')
    .in('user_id', ids)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('getFeed error', error);
    throw error;
  }
  return data;
}

export async function followUser(followerId: string, followingId: string) {
  const client = createBrowserClient();
  const { error } = await client
    .from('follows')
    .insert({ follower_id: followerId, following_id: followingId });
  if (error) {
    console.error('followUser error', error);
    throw error;
  }
}

export async function unfollowUser(
  followerId: string,
  followingId: string
) {
  const client = createBrowserClient();
  const { error } = await client
    .from('follows')
    .delete()
    .match({ follower_id: followerId, following_id: followingId });
  if (error) {
    console.error('unfollowUser error', error);
    throw error;
  }
}

export async function getFollowerCount(userId: string) {
  const { count, error } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('following_id', userId);
  if (error) {
    console.error('getFollowerCount error', error);
    throw error;
  }
  return count;
}

export async function createPost(
  userId: string,
  title: string,
  slug: string,
  content: string,
  coverImage?: string | null,
  tags?: string[]
) {
  const client = createBrowserClient();
  const { data, error } = await client
    .from('posts')
    .insert({
      user_id: userId,
      title,
      slug,
      content,
      cover_image: coverImage,
      tags,
    });
  if (error) {
    console.error('createPost error', error);
    throw error;
  }
  return data;
}

export async function getPostBySlug(slug: string) {
  const { data, error } = await supabase
    .from('posts')
    .select('*, users(username)')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('getPostBySlug error', error);
    throw error;
  }

  return data;
}

export async function getCommentsForPost(postId: string) {
  const { data, error } = await supabase
    .from('comments')
    .select('*, users(username)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('getCommentsForPost error', error);
    throw error;
  }
  return data;
}

export async function updatePost(
  postId: string,
  updates: Partial<{
    title: string;
    content: string;
    cover_image: string | null;
    tags: string[] | null;
  }>
) {
  const client = createBrowserClient();
  const { data, error } = await client
    .from('posts')
    .update(updates)
    .eq('id', postId);
  if (error) {
    console.error('updatePost error', error);
    throw error;
  }
  return data;
}

export async function deletePost(postId: string) {
  const client = createBrowserClient();
  const { error } = await client.from('posts').delete().eq('id', postId);
  if (error) {
    console.error('deletePost error', error);
    throw error;
  }
}

export async function getAllUsers() {
  const { data, error } = await supabase.from('users').select('*');
  if (error) {
    console.error('getAllUsers error', error);
    throw error;
  }
  return data;
}

export async function createComment(
  postId: string,
  userId: string,
  content: string
) {
  const client = createBrowserClient();
  const { data, error } = await client
    .from('comments')
    .insert({ post_id: postId, user_id: userId, content });
  if (error) {
    console.error('createComment error', error);
    throw error;
  }
  return data;
}

export async function getFollowingCount(userId: string) {
  const { count, error } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('follower_id', userId);
  if (error) {
    console.error('getFollowingCount error', error);
    throw error;
  }
  return count;
}

// more helper functions will be added as project grows
