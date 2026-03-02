import axios from 'axios';
import { API_BASE_URL } from '../config/env';

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// エラーハンドリング
http.interceptors.response.use(
  (res) => res,
  (err) => {
    switch (err.response?.status) {
      case 404:
        return Promise.reject(new Error('Not found.'));
      default:
        return Promise.reject(err);
    }
  },
);
