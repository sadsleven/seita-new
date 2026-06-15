/** App-wide runtime config, sourced from Vite env vars. */
export const config = {
  /** 'storage' → localStorage gateways (demo). 'http' → Axios gateways. */
  gateway: (import.meta.env.VITE_GATEWAY ?? 'storage') as 'storage' | 'http',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api',
} as const;

export const isStorageMode = config.gateway !== 'http';

/** localStorage key holding the bearer token for HTTP-mode requests. */
export const TOKEN_KEY = 'seita_token';
