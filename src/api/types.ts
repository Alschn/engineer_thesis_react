import type { AxiosResponse } from "axios";

// Axios types

export type Response<T> = AxiosResponse<T>;

export type PaginatedResponseData<T> = {
  count: number;
  previous: string | null;
  next: string | null;
  results: T[];
};

export type PaginatedResponse<T> = Response<PaginatedResponseData<T>>;

export type PromiseResponse<T> = Promise<Response<T>>;

export type PromisePaginatedResponse<T> = Promise<PaginatedResponse<T>>;

// API types
export interface Post {
  id: number;
  slug: string;
  title: string;
  description: string;
  body: string;
  author: ProfileEmbedded;
  created_at: string;
  updated_at: string;
  is_favourited: boolean;

  favourites_count: number;
  tags: string[];
}

export interface ListPost {
  id: number;
  slug: string;
  title: string;
  description: string;
  body: string;
  author: ProfileEmbedded;
  created_at: string;
  updated_at: string;
  tags: string[];
}

export interface Comment {
  id: number;
  body: string;
  post: number;
  author: ProfileEmbedded;
  created_at: string;
  updated_at: string;
}

export interface User {
}

export interface ProfileEmbedded {
  id: number;
  username: string;
  email: string;
  image: string | null;
  is_followed_by_you: boolean;
}

export interface ListProfile {
  id: number;
  username: string;
  image: string | null;
  is_following_you: boolean;
  is_followed_by_you: boolean;
}

export interface Profile {
  id: number;
  username: string;
  email: string;
  bio: string;
  image: string | null;
  is_following_you: boolean;
  is_followed_by_you: boolean;
  posts_count: number;

  favourites_count: number;
  followed_count: number;
  followers_count: number;
}

export interface Tag {
  id: number;
  tag: string;
  slug: string;
}

export interface SelectOption<T = string> {
  value: T;
  label: string;
}
