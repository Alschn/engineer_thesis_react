import type { AxiosRequestConfig } from "axios";
import type { PromiseResponse } from "./types";
import AxiosClient from "./AxiosClient";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UserRegisterPayload {
  username: string;
  email: string;
  password1: string;
  password2: string;
}

export interface LoginResponseBody {
  access: string;
  refresh: string;
}

type RefreshTokenResponseBody = Pick<LoginResponseBody, "access">;

class AuthAPI {
  login(
    payload: LoginPayload,
    options?: AxiosRequestConfig
  ): PromiseResponse<LoginResponseBody> {
    return AxiosClient.post(
      "/auth/token/",
      payload,
      options
    );
  }

  register(payload: UserRegisterPayload, options?: AxiosRequestConfig): PromiseResponse<any> {
    return AxiosClient.post("/auth/register/", payload, options);
  }

  refresh(options?: AxiosRequestConfig): PromiseResponse<RefreshTokenResponseBody> {
    const refresh = localStorage.getItem("refresh") || "";
    return AxiosClient.post("/auth/token/refresh/", { refresh }, options);
  }

  logout(options?: AxiosRequestConfig): PromiseResponse<{}> {
    const refresh = localStorage.getItem("refresh") || "";
    return AxiosClient.post("/auth/logout/", { refresh }, options);
  }
}

const AuthApi = new AuthAPI();

export default AuthApi;
