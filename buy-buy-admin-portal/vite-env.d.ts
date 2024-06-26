/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_BASE_URL: string,
  VITE_URL_ADMIN_LOGIN: string,
  VITE_URL_REFRESH: string,
  VITE_LOGOUT_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}