import { db } from './firebase';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  QueryConstraint,
} from 'firebase/firestore';
import type { Database } from './types';

export async function getUserByUsername(username: string) {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('username', '==', username));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    throw new Error('User not found');
  }
  return querySnapshot.docs[0].data();
}

export async function getPostsByUser(userId: string) {
  const postsRef = collection(db, 'posts');
  const q = query(
    postsRef,
    where('user_id', '==', userId),
    orderBy('created_at', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function getFeed(userId: string, limitNum = 20, offsetNum = 0) {
  // first get following list
  const followsRef = collection(db, 'follows');
  const q = query(followsRef, where('follower_id', '==', userId));
  const followSnapshot = await getDocs(q);
  const followingIds = followSnapshot.docs.map((doc) => doc.data().following_id);

  if (followingIds.length === 0) {
    return [];
  }

  // get posts from following users
  const postsRef = collection(db, 'posts');
  const constraints: QueryConstraint[] = [
    where('user_id', 'in', followingIds),
    orderBy('created_at', 'desc'),
  ];
  const postQuery = query(postsRef, ...constraints);
  const postSnapshot = await getDocs(postQuery);
  return postSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function followUser(followerId: string, followingId: string) {
  const followsRef = doc(db, 'follows', `${followerId}_${followingId}`);
  await setDoc(followsRef, {
    follower_id: followerId,
    following_id: followingId,
    created_at: new Date(),
  });
}

export async function unfollowUser(followerId: string, followingId: string) {
  const followsRef = doc(db, 'follows', `${followerId}_${followingId}`);
  await deleteDoc(followsRef);
}

export async function getFollowerCount(userId: string) {
  const followsRef = collection(db, 'follows');
  const q = query(followsRef, where('following_id', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.size;
}

export async function getFollowingCount(userId: string) {
  const followsRef = collection(db, 'follows');
  const q = query(followsRef, where('follower_id', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.size;
}

export async function createPost(
  userId: string,
  title: string,
  slug: string,
  content: string,
  coverImage?: string | null,
  tags?: string[]
) {
  const postRef = doc(collection(db, 'posts'));
  const postData = {
    user_id: userId,
    title,
    slug,
    content,
    cover_image: coverImage || null,
    tags: tags || [],
    created_at: new Date(),
  };
  await setDoc(postRef, postData);
  return { id: postRef.id, ...postData };
}

export async function getPostBySlug(slug: string) {
  const postsRef = collection(db, 'posts');
  const q = query(postsRef, where('slug', '==', slug));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    throw new Error('Post not found');
  }
  const doc = querySnapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}

export async function getCommentsForPost(postId: string) {
  const commentsRef = collection(db, 'comments');
  const q = query(
    commentsRef,
    where('post_id', '==', postId),
    orderBy('created_at', 'asc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function createComment(
  postId: string,
  userId: string,
  content: string
) {
  const commentRef = doc(collection(db, 'comments'));
  const commentData = {
    post_id: postId,
    user_id: userId,
    content,
    created_at: new Date(),
  };
  await setDoc(commentRef, commentData);
  return { id: commentRef.id, ...commentData };
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
  const postRef = doc(db, 'posts', postId);
  await updateDoc(postRef, updates);
}

export async function deletePost(postId: string) {
  const postRef = doc(db, 'posts', postId);
  await deleteDoc(postRef);
}

export async function getAllUsers() {
  const usersRef = collection(db, 'users');
  const querySnapshot = await getDocs(usersRef);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
