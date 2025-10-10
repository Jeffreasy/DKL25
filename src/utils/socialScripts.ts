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
  console.log('[DEBUG] loadFacebookSDK called', { loading: !!facebookScriptLoadingPromise, loaded: facebookScriptLoaded, hasFB: !!window.FB });
  
  // Return existing promise if already loading
  if (facebookScriptLoadingPromise) {
    console.log('[DEBUG] Returning existing Facebook promise');
    return facebookScriptLoadingPromise;
  }

  // Return resolved promise if already loaded
  if (facebookScriptLoaded && window.FB) {
    console.log('[DEBUG] Facebook already loaded, resolving immediately');
    return Promise.resolve();
  }

  facebookScriptLoadingPromise = new Promise((resolve, reject) => {
    // Check if script already exists in DOM
    const existingScript = document.querySelector('script[src*="connect.facebook.net"]');
    if (existingScript && window.FB) {
      console.log('[DEBUG] Facebook script exists and FB available');
      facebookScriptLoaded = true;
      facebookScriptLoadingPromise = null;
      resolve();
      return;
    }

    console.log('[DEBUG] Creating new Facebook script');
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
      console.log('[DEBUG] Facebook script loaded, checking for FB object');
      let attempts = 0;
      const maxAttempts = 20;
      
      const checkFacebook = () => {
        console.log(`[DEBUG] Checking Facebook (attempt ${attempts + 1}/${maxAttempts})`, { hasFB: !!window.FB, hasXFBML: !!window.FB?.XFBML });
        
        if (window.FB) {
          console.log('[DEBUG] Facebook SDK ready!');
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
          console.error('[DEBUG] Facebook SDK timeout');
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
      console.error('[DEBUG] Facebook script load error', error);
      cleanup();
      facebookScriptLoadingPromise = null;
      if (!resolved) {
        resolved = true;
        reject(new Error('Failed to load Facebook SDK'));
      }
    };

    document.head.appendChild(script);
  });

  return facebookScriptLoadingPromise;
};

let instagramScriptLoadingPromise: Promise<void> | null = null;
let instagramScriptLoaded = false;

export const loadInstagramEmbed = (): Promise<void> => {
  console.log('[DEBUG] loadInstagramEmbed called', { loading: !!instagramScriptLoadingPromise, loaded: instagramScriptLoaded, hasInstgrm: !!window.instgrm });
  
  // Return existing promise if already loading
  if (instagramScriptLoadingPromise) {
    console.log('[DEBUG] Returning existing Instagram promise');
    return instagramScriptLoadingPromise;
  }

  // Return resolved promise if already loaded
  if (instagramScriptLoaded && window.instgrm) {
    console.log('[DEBUG] Instagram already loaded, resolving immediately');
    return Promise.resolve();
  }

  instagramScriptLoadingPromise = new Promise((resolve, reject) => {
    // Check if script already exists in DOM
    const existingScript = document.querySelector('script[src*="instagram.com/embed.js"]');
    if (existingScript && window.instgrm) {
      console.log('[DEBUG] Instagram script exists and instgrm available');
      instagramScriptLoaded = true;
      instagramScriptLoadingPromise = null;
      resolve();
      return;
    }

    console.log('[DEBUG] Creating new Instagram script');
    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = false; // Load synchronously to ensure proper initialization

    let timeoutId: NodeJS.Timeout | null = null;
    let resolved = false;

    const cleanup = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    script.onload = () => {
      console.log('[DEBUG] Instagram script loaded, checking for instgrm object');
      let attempts = 0;
      const maxAttempts = 50; // Increased from 20

      const checkInstagram = () => {
        console.log(`[DEBUG] Checking Instagram (attempt ${attempts + 1}/${maxAttempts})`, { hasInstgrm: !!window.instgrm, hasEmbeds: !!window.instgrm?.Embeds });

        if (window.instgrm?.Embeds?.process) {
          console.log('[DEBUG] Instagram SDK ready!');
          instagramScriptLoaded = true;
          instagramScriptLoadingPromise = null;
          cleanup();
          if (!resolved) {
            resolved = true;
            resolve();
          }
        } else if (attempts < maxAttempts) {
          attempts++;
          const delay = 200 + (attempts * 100); // Increased delay: 200ms + 100ms per attempt
          timeoutId = setTimeout(checkInstagram, delay);
        } else {
          console.error('[DEBUG] Instagram SDK timeout');
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
      console.error('[DEBUG] Instagram script load error', error);
      cleanup();
      instagramScriptLoadingPromise = null;
      if (!resolved) {
        resolved = true;
        reject(new Error('Failed to load Instagram embed script'));
      }
    };

    document.head.appendChild(script);
  });

  return instagramScriptLoadingPromise;
};

export default {
  loadFacebookSDK,
  loadInstagramEmbed
}; 