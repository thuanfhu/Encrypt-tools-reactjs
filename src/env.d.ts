/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_DH_PRIME: string;
    readonly VITE_BIGRAM_DEFAULT_KEY: string;
  }
  
interface ImportMeta {
    readonly env: ImportMetaEnv;
}