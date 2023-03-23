import type { AxiosRequestConfig } from "axios";
import AxiosClient from "./AxiosClient";
import type { Profile, PromisePaginatedResponse, PromiseResponse, } from "./types";

export interface ProfilesFilters {
  page?: number;
  page_size?: number;
  username?: string;
  username__icontains?: string;
}

class ProfilesAPI {

  getAll(params?: ProfilesFilters, options?: AxiosRequestConfig): PromisePaginatedResponse<Profile> {
    return AxiosClient.get(`/profiles/`, { params, ...options });
  }

  getFollowers(
    username: string,
    params?: ProfilesFilters,
    options?: AxiosRequestConfig
  ): PromisePaginatedResponse<Profile> {
    return AxiosClient.get(`/profiles/${username}/followers/`, { params, ...options });
  }

  getFollowed(
    username: string,
    params?: ProfilesFilters,
    options?: AxiosRequestConfig
  ): PromisePaginatedResponse<Profile> {
    return AxiosClient.get(`/profiles/${username}/followed/`, { params, ...options });
  }

  getProfile(
    username: string,
    options?: AxiosRequestConfig
  ): PromiseResponse<Profile> {
    return AxiosClient.get(`/profiles/${username}/`, options);
  }

  follow(
    username: string,
    options?: AxiosRequestConfig
  ): PromiseResponse<Profile> {
    return AxiosClient.post(`/profiles/${username}/follow/`, {}, options);
  }

  unfollow(
    username: string,
    options?: AxiosRequestConfig
  ): PromiseResponse<Profile> {
    return AxiosClient.delete(`/profiles/${username}/follow/`, options);
  }
}

const ProfilesApi = new ProfilesAPI();

export default ProfilesApi;
