export {};

declare global {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    DISCOGS_API_CONSUMER_KEY: string;
    DISCOGS_API_CONSUMER_SECRET: string;
    APP_PRODUCTION_URL: string;
  }
  interface Process {
    env: ProcessEnv;
  }
  let process: Process;
}
