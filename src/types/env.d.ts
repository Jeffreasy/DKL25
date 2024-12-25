declare namespace NodeJS {
  interface ProcessEnv {
    MAILGUN_API_KEY: string;
    MAILGUN_DOMAIN: string;
    MAILGUN_FROM: string;
    [key: string]: string | undefined;
  }
} 