import axios from 'axios';
import { API_BASE_URL } from '../config/env';
import { ApiError } from '../api/ApiError';

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// エラーハンドリング
http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (axios.isAxiosError(err)) {
      // ネットワークエラー
      if (!err.response) {
        return Promise.reject(ApiError.network(err.message));
      }

      return Promise.reject(
        ApiError.fromStatus(err.response.status, err.message),
      );
    }

    return Promise.reject(ApiError.unknown());
  },
);
