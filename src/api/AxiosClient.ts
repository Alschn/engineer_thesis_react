import axios, { AxiosError, type  AxiosRequestConfig } from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const AUTH_TOKEN_PREFIX = "Bearer";
const REFRESH_TOKEN_TIMEOUT_MS = 5_000;

export const axiosBaseConfig: AxiosRequestConfig = {
  headers: { "Content-Type": "application/json" },
  baseURL: BASE_URL,
};

const AxiosClient = axios.create(axiosBaseConfig);

AxiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  config.headers.Authorization = token ? `${AUTH_TOKEN_PREFIX} ${token}` : "";
  return config;
});

AxiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response, config } = error;
    if (!response || response.status !== 401) return Promise.reject(error);

    const refreshToken = localStorage.getItem("refresh");

    // could not find refresh token, cannot refresh access token
    if (!refreshToken) {
      localStorage.removeItem('access');
      // window.location.pathname = "/auth/login";
      return Promise.reject(error);
    }

    // try to refresh access token
    return axios.post(`/auth/token/refresh/`, { refresh: refreshToken }, {
      ...axiosBaseConfig,
      timeout: REFRESH_TOKEN_TIMEOUT_MS,
    }).then((res) => {
      const { access } = res.data;
      localStorage.setItem('access', access);
      return AxiosClient(config);
    }).catch((err) => {
      // `refresh` is missing or has expired,
      // the only way to get new access token is to sign in again
      if (err instanceof AxiosError && [400, 401].includes(err.response?.status!)) {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        // window.location.pathname = "/auth/login";
      }
      return Promise.reject(error);
    });
  }
);

export default AxiosClient;
