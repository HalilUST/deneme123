// Minimal types for Supabase schema - extend as needed

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          email: string;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
        };
        Insert: {
          username: string;
          email: string;
          avatar_url?: string | null;
          bio?: string | null;
        };
        Update: {
          username?: string;
          email?: string;
          avatar_url?: string | null;
          bio?: string | null;
        };
      };
      posts: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          slug: string;
          content: string;
          cover_image: string | null;
          tags: string[] | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          title: string;
          slug: string;
          content: string;
          cover_image?: string | null;
          tags?: string[] | null;
        };
        Update: {
          title?: string;
          slug?: string;
          content?: string;
          cover_image?: string | null;
          tags?: string[] | null;
        };
      };
      follows: {
        Row: {
          follower_id: string;
          following_id: string;
          created_at: string;
        };
        Insert: {
          follower_id: string;
          following_id: string;
        };
        Update: {};
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          post_id: string;
          user_id: string;
          content: string;
        };
        Update: {
          content?: string;
        };
      };
      likes: {
        Row: {
          post_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          post_id: string;
          user_id: string;
        };
        Update: {};
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}
