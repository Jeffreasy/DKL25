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
  // Return existing promise if already loading
  if (facebookScriptLoadingPromise) {
    return facebookScriptLoadingPromise;
  }

  // Return resolved promise if already loaded
  if (facebookScriptLoaded && window.FB) {
    return Promise.resolve();
  }

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
  // Return existing promise if already loading
  if (instagramScriptLoadingPromise) {
    return instagramScriptLoadingPromise;
  }

  // Return resolved promise if already loaded
  if (instagramScriptLoaded && window.instgrm) {
    return Promise.resolve();
  }

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
      script.async = false; // Load synchronously to ensure proper initialization

      // iOS-specific: Add additional attributes for better compatibility
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent || navigator.vendor || (window as any).opera) && !(window as any).MSStream;
      if (isIOS) {
        script.setAttribute('data-instgrm-version', '14');
        script.crossOrigin = 'anonymous';
      }

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
        const maxAttempts = 50; // Increased from 20

        const checkInstagram = () => {
          if (window.instgrm?.Embeds?.process) {
            instagramScriptLoaded = true;
            instagramScriptLoadingPromise = null;
            cleanup();
            if (!resolved) {
              resolved = true;
              resolve();
            }
          } else if (attempts < maxAttempts) {
            attempts++;
            // iOS needs longer delays for proper initialization
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent || navigator.vendor || (window as any).opera) && !(window as any).MSStream;
            const delay = isIOS ? 500 + (attempts * 200) : 200 + (attempts * 100);
            timeoutId = setTimeout(checkInstagram, delay);
          } else {
            cleanup();
            instagramScriptLoadingPromise = null;
            if (!resolved) {
              resolved = true;
              reject(new Error('Instagram embed script failed to initialize'));
            }
          }
        };

        checkInstagram();
      };

      script.onerror = (error) => {
        cleanup();
        instagramScriptLoadingPromise = null;
        if (!resolved) {
          resolved = true;
          reject(new Error('Failed to load Instagram embed script'));
        }
      };

      document.head.appendChild(script);
    };

    // Defer loading until after page load event
    window.addEventListener('load', () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(loadScript);
      } else {
        setTimeout(loadScript, 300);
      }
    });
  });

  return instagramScriptLoadingPromise;
};

export default {
  loadFacebookSDK,
  loadInstagramEmbed
}; 