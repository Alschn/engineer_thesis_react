import type { AxiosRequestConfig } from "axios";
import AxiosClient from "./AxiosClient";
import type { Comment, ListPost, Post, PromisePaginatedResponse, PromiseResponse } from "./types";

export interface PostCreatePayload {
  title: string;
  description: string;
  body: string;
  tags: string[];
}

export type PostUpdatePayload = Partial<Pick<Post, 'body'>>;

type OrderByCreatedAt = 'created_at' | '-created_at';
type OrderByUpdatedAt = 'updated_at' | '-updated_at';
export type PostsOrdering = OrderByCreatedAt | OrderByUpdatedAt;

export interface PostsFilters {
  page?: number;
  page_size?: number;
  slug?: string;
  slug__icontains?: string;
  title__icontains?: string;
  description__icontains?: string;
  author__user__username__icontains?: string;
  author__user__username?: string;
  tags__tag__icontains?: string;
  created_at__gte?: string;
  created_at__lte?: string;
  ordering?: PostsOrdering;
  search?: string;
}

export interface PostFiltersEventDetail {
  title: string;
  slug: string;
  author: string[];
  tags: string[];
  created_at__gte: string;
  created_at__lte: string;
}

export interface PostCommentsFilters {
  page?: number;
  page_size?: number;
  ordering?: OrderByCreatedAt;
}

class PostsAPI {
  getAll(
    params?: PostsFilters,
    options?: AxiosRequestConfig
  ): PromisePaginatedResponse<ListPost> {
    return AxiosClient.get(`/posts/`, {
      params,
      ...options,
    });
  }

  getFeed(
    params?: PostsFilters,
    options?: AxiosRequestConfig
  ): PromisePaginatedResponse<ListPost> {
    return AxiosClient.get(`/posts/feed/`, {
      params,
      ...options,
    });
  }

  getFavourites(
    params?: PostsFilters,
    options?: AxiosRequestConfig
  ): PromisePaginatedResponse<ListPost> {
    return AxiosClient.get(`/posts/favourites/`, {
      params,
      ...options,
    });
  }

  getPost(
    postSlug: string,
    options?: AxiosRequestConfig
  ): PromiseResponse<Post> {
    return AxiosClient.get(`/posts/${postSlug}/`, options);
  }

  createPost(
    payload: PostCreatePayload,
    options?: AxiosRequestConfig
  ): PromiseResponse<any> {
    return AxiosClient.post(`/posts/`, payload, options);
  }

  deletePost(
    postSlug: string,
    options?: AxiosRequestConfig
  ): PromiseResponse<{}> {
    return AxiosClient.delete(`/posts/${postSlug}/`, options);
  }

  updatePost(
    postSlug: string,
    payload: PostUpdatePayload,
    options?: AxiosRequestConfig
  ): PromiseResponse<Post> {
    return AxiosClient.patch(`/posts/${postSlug}/`, payload, options);
  }

  addToFavourites(
    postSlug: string,
    options?: AxiosRequestConfig
  ): PromiseResponse<Post> {
    return AxiosClient.post(`/posts/${postSlug}/favourite/`, {}, options);
  }

  removeFromFavourites(
    postSlug: string,
    options?: AxiosRequestConfig
  ): PromiseResponse<Post> {
    return AxiosClient.delete(`/posts/${postSlug}/favourite/`, options);
  }

  getAllComments(
    postSlug: string,
    params: PostCommentsFilters,
    options?: AxiosRequestConfig
  ): PromisePaginatedResponse<Comment> {
    return AxiosClient.get(`/posts/${postSlug}/comments/`, {
      params,
      ...options,
    });
  }

  addComment(
    postSlug: string,
    body: string,
    options?: AxiosRequestConfig
  ): PromiseResponse<Comment> {
    return AxiosClient.post(`/comments/`, { body, post: postSlug }, options);
  }

  deleteComment(
    postSlug: string,
    commentId: number,
    options?: AxiosRequestConfig
  ): PromiseResponse<{}> {
    return AxiosClient.delete(`/posts/${postSlug}/comments/${commentId}/`, options);
  }
}

const PostsApi = new PostsAPI();

export default PostsApi;
