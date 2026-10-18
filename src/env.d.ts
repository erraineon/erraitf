/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly GIT_COMMIT_HASH: string;
  readonly GIT_COMMIT_DATE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
