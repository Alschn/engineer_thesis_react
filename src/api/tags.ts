import type { AxiosRequestConfig } from "axios";
import type { PromisePaginatedResponse, Tag } from "./types";
import AxiosClient from "./AxiosClient";

export interface TagsFilters {
  page?: number;
  page_size?: number;
  tag__icontains?: string;
  tag?: string;
}

class TagsAPI {
  getAll(params?: TagsFilters, options?: AxiosRequestConfig): PromisePaginatedResponse<Tag> {
    return AxiosClient.get(`/tags/`, { params, ...options });
  }
}

const TagsApi = new TagsAPI();

export default TagsApi;
