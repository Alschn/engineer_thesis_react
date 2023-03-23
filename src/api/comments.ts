import type { AxiosRequestConfig } from "axios";
import AxiosClient from "./AxiosClient";
import type { Comment, PromisePaginatedResponse } from "./types";

interface CommentsFilters {
  page?: number;
  page_size?: number;
  post?: number;
  post__title?: string;
  post__slug?: string;
  author?: number;
}

interface CreateCommentPayload {
  body: string;
  post: string;
}

class CommentsAPI {
  getAll(params?: CommentsFilters, options?: AxiosRequestConfig): PromisePaginatedResponse<Comment> {
    return AxiosClient.get(`/comments/`, {
      params,
      ...options
    });
  }

  create(payload: CreateCommentPayload, options?: AxiosRequestConfig) {
    return AxiosClient.post(`/comments/`, payload, options);
  }
}

const commentsApi = new CommentsAPI();

export default commentsApi;
