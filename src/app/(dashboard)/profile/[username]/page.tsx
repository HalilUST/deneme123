import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/auth';
import {
  getUserByUsername,
  getPostsByUser,
  getFollowerCount,
  getFollowingCount,
  followUser,
  unfollowUser,
} from '@/lib/db';

export default function ProfilePage({ params }: { params: { username: string } }) {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [followers, setFollowers] = useState<number>(0);
  const [following, setFollowing] = useState<number>(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const user = await getUser();
        const profileData = await getUserByUsername(params.username);
        if (!profileData) {
          setError('User not found');
          return;
        }
        setProfile(profileData);

        const postData = await getPostsByUser(profileData.id);
        setPosts(postData || []);

        const fcount = await getFollowerCount(profileData.id);
        setFollowers(fcount || 0);

        const ficount = await getFollowingCount(profileData.id);
        setFollowing(ficount || 0);

        if (user) {
          setCurrentUser(user);
          if (user.id !== profileData.id) {
            const { data: existing } = await fetch(
              `/api/follow-status?user=${user.id}&target=${profileData.id}`
            ).then((r) => r.json());
            setIsFollowing(existing?.isFollowing);
          }
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.username]);

  const handleFollow = async () => {
    try {
      const user = await getUser();
      if (!user || !profile) return;
      if (isFollowing) {
        await unfollowUser(user.id, profile.id);
        setFollowers((f) => f - 1);
      } else {
        await followUser(user.id, profile.id);
        setFollowers((f) => f + 1);
      }
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading profile…</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!profile) return <div>No profile</div>;

  return (
    <div className="space-y-6">
      <header className="flex items-center space-x-4">
        <img
          src={profile.avatar_url || '/default-avatar.png'}
          alt="avatar"
          className="h-16 w-16 rounded-full"
        />
        <div>
          <h1 className="text-2xl font-semibold">{profile.username}</h1>
          <p>{profile.bio}</p>
        </div>
        <div className="ml-auto">
          {currentUser && profile.id !== currentUser.id && (
            <button
              onClick={handleFollow}
              className="rounded bg-indigo-600 px-4 py-1 text-white"
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
      </header>

      <div className="flex space-x-6">
        <span>{followers} followers</span>
        <span>{following} following</span>
      </div>

      <section>
        <h2 className="text-xl font-semibold">Posts</h2>
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          <ul className="space-y-4">
            {posts.map((p) => (
              <li key={p.id} className="border p-4 bg-white">
                <a href={`/blog/${p.slug}`} className="text-indigo-600">
                  {p.title}
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
