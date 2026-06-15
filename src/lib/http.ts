import axios from 'axios';
import { config, TOKEN_KEY } from './config';

/** Shared Axios instance for HTTP-mode gateways (production). */
export const http = axios.create({
  baseURL: config.apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20_000,
});

http.interceptors.request.use((req) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});
