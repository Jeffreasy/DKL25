declare namespace NodeJS {
  interface ProcessEnv {
    // Supabase
    VITE_SUPABASE_URL: string;
    VITE_SUPABASE_ANON_KEY: string;
    VITE_SUPABASE_USER: string;
    VITE_SUPABASE_PASSWORD: string;

    // Mailgun
    MAILGUN_API_KEY: string;
    MAILGUN_DOMAIN: string;
    MAILGUN_FROM: string;
    MAILGUN_ADMIN_EMAIL: string;
    MAILGUN_WEBHOOK_SIGNING_KEY: string;
    VITE_MAILGUN_PUBLIC_KEY: string;
    VITE_MAILGUN_DOMAIN: string;

    // API URLs
    NEXT_PUBLIC_API_URL: string;
    VITE_MAKE_WEBHOOK_URL: string;

    // Cloudinary
    VITE_CLOUDINARY_CLOUD_NAME: string;
    VITE_CLOUDINARY_API_KEY: string;
    VITE_CLOUDINARY_API_SECRET: string;

    // Other
    VITE_INSTAGRAM_ACCESS_TOKEN: string;
    VERCEL_SPEED_INSIGHTS: string;
  }
} 