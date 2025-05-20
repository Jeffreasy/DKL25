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

export const loadFacebookSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.FB) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/nl_NL/sdk.js#xfbml=1&version=v18.0';
    script.async = true;
    script.defer = true;
    script.nonce = 'random_nonce';

    script.onload = () => {
      if (window.FB) {
        resolve();
      } else {
        reject(new Error('Facebook SDK failed to initialize'));
      }
    };

    script.onerror = () => {
      reject(new Error('Failed to load Facebook SDK'));
    };

    document.body.appendChild(script);
  });
};

let instagramScriptLoadingPromise: Promise<void> | null = null;
let instagramScriptLoaded = false;

export const loadInstagramEmbed = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.instgrm) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = '//www.instagram.com/embed.js';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      // Give Instagram's script time to initialize
      setTimeout(() => {
        if (window.instgrm) {
          resolve();
        } else {
          reject(new Error('Instagram embed script failed to initialize'));
        }
      }, 1000);
    };

    script.onerror = () => {
      reject(new Error('Failed to load Instagram embed script'));
    };

    document.body.appendChild(script);
  });
};

export default {
  loadFacebookSDK,
  loadInstagramEmbed
}; 