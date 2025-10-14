import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react({
      // Enable JSX runtime for better performance
      jsxRuntime: 'automatic',
    }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/res\.cloudinary\.com\/.*\.(png|jpg|jpeg|webp|svg)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cloudinary-images',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          {
            urlPattern: /^https:\/\/connect\.facebook\.net\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'facebook-sdk',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          {
            urlPattern: /^https:\/\/www\.instagram\.com\/embed\.js/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'instagram-embed',
              expiration: {
                maxEntries: 5,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          }
        ]
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'De Koninklijke Loop 2026',
        short_name: 'DKL 2026',
        description: 'De Koninklijke Loop 2026 is een uniek hardloopevenement waar mensen met een beperking wandelen voor het goede doel.',
        theme_color: '#FF6B00',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/favicon.jpg',
            sizes: '192x192',
            type: 'image/jpeg',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 500, // Lower threshold to catch issues earlier
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React ecosystem in separate chunk
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router') || id.includes('use-sync-external-store') || id.includes('@emotion')) {
              return 'vendor-react';
            }
            // Material UI in separate chunk
            if (id.includes('@mui')) {
              return 'vendor-mui';
            }
            // Framer Motion in separate chunk
            if (id.includes('framer-motion')) {
              return 'vendor-framer';
            }
            // PDF and canvas libraries removed - no longer used
            // Canvas confetti in separate chunk since it's dynamically imported
            if (id.includes('canvas-confetti')) {
              return 'vendor-confetti';
            }
            // Supabase in separate chunk
            if (id.includes('supabase') || id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            // Other large libraries - optimize by removing unused code
            if (id.includes('date-fns') || id.includes('lodash') || id.includes('dompurify')) {
              return 'vendor-utils';
            }
            // All other node_modules
            return 'vendor-other';
          }

          // Feature-based chunking for large features
          if (id.includes('src/features/gallery')) {
            return 'feature-gallery';
          }
          if (id.includes('src/features/video')) {
            return 'feature-video';
          }
          if (id.includes('src/features/partners')) {
            return 'feature-partners';
          }
          if (id.includes('src/features/program')) {
            return 'feature-program';
          }
          if (id.includes('src/features/sponsors')) {
            return 'feature-sponsors';
          }

          // Page-based chunking for better loading
          if (id.includes('src/pages/')) {
            const pageName = id.split('/pages/')[1]?.split('/')[0];
            if (pageName) {
              return `page-${pageName}`;
            }
          }
        },
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
      // Enable tree shaking and minification optimizations
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
    },
    // Enable minification and compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.error('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
});
