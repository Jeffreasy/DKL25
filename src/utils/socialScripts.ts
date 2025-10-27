declare global {
  interface Window {
    FB?: {
      XFBML: {
        parse: () => void;
      };
      init: (options: {
        appId?: string;
        version: string;
        xfbml?: boolean;
        status?: boolean;
        cookie?: boolean;
        autoLogAppEvents?: boolean;
      }) => void;
    };
    instgrm?: {
      Embeds: {
        process: (element?: HTMLElement) => void;
      };
    };
  }
}

let facebookScriptLoadingPromise: Promise<void> | null = null;
let facebookScriptLoaded = false;

export const loadFacebookSDK = (): Promise<void> => {
  console.log('loadFacebookSDK called');
  // Return existing promise if already loading
  if (facebookScriptLoadingPromise) {
    console.log('Facebook SDK already loading, returning existing promise');
    return facebookScriptLoadingPromise;
  }

  // Return resolved promise if already loaded
  if (facebookScriptLoaded && window.FB) {
    console.log('Facebook SDK already loaded');
    return Promise.resolve();
  }

  console.log('Starting Facebook SDK load');
  facebookScriptLoadingPromise = new Promise((resolve, reject) => {
    // Check if script already exists in DOM
    const existingScript = document.querySelector('script[src*="connect.facebook.net"]');
    if (existingScript && window.FB) {
      facebookScriptLoaded = true;
      facebookScriptLoadingPromise = null;
      resolve();
      return;
    }

    const loadScript = () => {
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/nl_NL/sdk.js#xfbml=1&version=v18.0';
      script.async = true;
      script.crossOrigin = 'anonymous';

      let timeoutId: NodeJS.Timeout | null = null;
      let resolved = false;

      const cleanup = () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
      };

      script.onload = () => {
        let attempts = 0;
        const maxAttempts = 20;

        const checkFacebook = () => {
          if (window.FB) {
            facebookScriptLoaded = true;
            facebookScriptLoadingPromise = null;
            cleanup();
            if (!resolved) {
              resolved = true;
              resolve();
            }
          } else if (attempts < maxAttempts) {
            attempts++;
            const delay = 100 + (attempts * 50);
            timeoutId = setTimeout(checkFacebook, delay);
          } else {
            cleanup();
            facebookScriptLoadingPromise = null;
            if (!resolved) {
              resolved = true;
              reject(new Error('Facebook SDK failed to initialize'));
            }
          }
        };

        checkFacebook();
      };

      script.onerror = (error) => {
        cleanup();
        facebookScriptLoadingPromise = null;
        if (!resolved) {
          resolved = true;
          reject(new Error('Failed to load Facebook SDK'));
        }
      };

      document.head.appendChild(script);
    };

    // Defer loading until after page load event
    window.addEventListener('load', () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(loadScript);
      } else {
        setTimeout(loadScript, 200);
      }
    });
  });

  return facebookScriptLoadingPromise;
};

let instagramScriptLoadingPromise: Promise<void> | null = null;
let instagramScriptLoaded = false;

export const loadInstagramEmbed = (): Promise<void> => {
  console.log('loadInstagramEmbed called');
  // Return existing promise if already loading
  if (instagramScriptLoadingPromise) {
    console.log('Instagram embed already loading, returning existing promise');
    return instagramScriptLoadingPromise;
  }

  // Return resolved promise if already loaded
  if (instagramScriptLoaded && window.instgrm) {
    console.log('Instagram embed already loaded');
    return Promise.resolve();
  }

  console.log('Starting Instagram embed load');
  instagramScriptLoadingPromise = new Promise((resolve, reject) => {
    // Check if script already exists in DOM
    const existingScript = document.querySelector('script[src*="instagram.com/embed.js"]');
    if (existingScript && window.instgrm) {
      instagramScriptLoaded = true;
      instagramScriptLoadingPromise = null;
      resolve();
      return;
    }

    const loadScript = () => {
      const script = document.createElement('script');
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true; // Changed to async for better performance
      script.defer = true; // Add defer for proper loading order
      script.crossOrigin = 'anonymous';

      let timeoutId: NodeJS.Timeout | null = null;
      let resolved = false;

      const cleanup = () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
      };

      // Overall timeout to prevent infinite waiting
      const overallTimeout = setTimeout(() => {
        cleanup();
        if (!resolved) {
          resolved = true;
          console.warn('Instagram script loading timeout after 10s');
          reject(new Error('Instagram embed script loading timeout'));
        }
      }, 10000);

      script.onload = () => {
        let attempts = 0;
        const maxAttempts = 30;

        const checkInstagram = () => {
          if (window.instgrm?.Embeds?.process) {
            instagramScriptLoaded = true;
            instagramScriptLoadingPromise = null;
            cleanup();
            clearTimeout(overallTimeout);
            if (!resolved) {
              resolved = true;
              console.log('Instagram embed script loaded successfully');
              resolve();
            }
          } else if (attempts < maxAttempts) {
            attempts++;
            const delay = 100 + (attempts * 50); // Progressive delay
            timeoutId = setTimeout(checkInstagram, delay);
          } else {
            cleanup();
            clearTimeout(overallTimeout);
            instagramScriptLoadingPromise = null;
            if (!resolved) {
              resolved = true;
              console.error('Instagram embed script failed to initialize after', maxAttempts, 'attempts');
              reject(new Error('Instagram embed script failed to initialize'));
            }
          }
        };

        checkInstagram();
      };

      script.onerror = (error) => {
        cleanup();
        clearTimeout(overallTimeout);
        instagramScriptLoadingPromise = null;
        if (!resolved) {
          resolved = true;
          console.error('Failed to load Instagram embed script:', error);
          reject(new Error('Failed to load Instagram embed script'));
        }
      };

      document.head.appendChild(script);
    };

    // Load immediately if DOM is ready, otherwise wait
    if (document.readyState === 'complete') {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(loadScript, { timeout: 2000 });
      } else {
        setTimeout(loadScript, 100);
      }
    } else {
      window.addEventListener('load', () => {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(loadScript, { timeout: 2000 });
        } else {
          setTimeout(loadScript, 100);
        }
      });
    }
  });

  return instagramScriptLoadingPromise;
};

export default {
  loadFacebookSDK,
  loadInstagramEmbed
}; 