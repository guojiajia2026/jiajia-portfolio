/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DEEPSEEK_API_KEY?: string
  readonly OPENAI_API_KEY?: string
  readonly AI_BASE_URL?: string
  readonly AI_MODEL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
