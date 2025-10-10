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
  console.log('Loading Facebook SDK...', { loading: !!facebookScriptLoadingPromise, loaded: facebookScriptLoaded, hasFB: !!window.FB });
  
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

  facebookScriptLoadingPromise = new Promise((resolve, reject) => {
    // Check if script already exists in DOM
    const existingScript = document.querySelector('script[src*="connect.facebook.net"]');
    if (existingScript && window.FB) {
      console.log('Facebook SDK script already exists');
      facebookScriptLoaded = true;
      facebookScriptLoadingPromise = null;
      resolve();
      return;
    }

    console.log('Loading Facebook SDK script...');
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
      console.log('Facebook SDK script loaded, initializing...');
      let attempts = 0;
      const maxAttempts = 20;

      const checkFacebook = () => {
        if (window.FB) {
          console.log('Facebook SDK initialized successfully');
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
          console.error('Facebook SDK initialization timeout');
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
      console.error('Failed to load Facebook SDK script', error);
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
  console.log('Loading Instagram SDK...', { loading: !!instagramScriptLoadingPromise, loaded: instagramScriptLoaded, hasInstgrm: !!window.instgrm });
  
  // Return existing promise if already loading
  if (instagramScriptLoadingPromise) {
    console.log('Instagram SDK already loading, returning existing promise');
    return instagramScriptLoadingPromise;
  }

  // Return resolved promise if already loaded
  if (instagramScriptLoaded && window.instgrm) {
    console.log('Instagram SDK already loaded');
    return Promise.resolve();
  }

  instagramScriptLoadingPromise = new Promise((resolve, reject) => {
    // Check if script already exists in DOM
    const existingScript = document.querySelector('script[src*="instagram.com/embed.js"]');
    if (existingScript && window.instgrm) {
      console.log('Instagram SDK script already exists');
      instagramScriptLoaded = true;
      instagramScriptLoadingPromise = null;
      resolve();
      return;
    }

    console.log('Loading Instagram SDK script...');
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
      console.log('Instagram SDK script loaded, initializing...');
      let attempts = 0;
      const maxAttempts = 50; // Increased from 20

      const checkInstagram = () => {
        if (window.instgrm?.Embeds?.process) {
          console.log('Instagram SDK initialized successfully');
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
          console.error('Instagram SDK initialization timeout');
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
      console.error('Failed to load Instagram SDK script', error);
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