/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_APP_API_URL: string
  // diğer env değişkenlerini buraya ekleyin
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
