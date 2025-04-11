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

export const loadFacebookSDK = () => {
  return new Promise<void>((resolve) => { 
    // Check if already loaded
    if (window.FB) {
      resolve();
      return;
    }
    // Simple check if script tag exists
    if (document.getElementById('facebook-jssdk')) {
       // Assume it will load or is loading, rely on onload
       // A more robust singleton could be added if needed
       const checkFbInterval = setInterval(() => {
           if (window.FB) {
               clearInterval(checkFbInterval);
               resolve();
           }
       }, 100);
       // Timeout failsafe
       setTimeout(() => {
           clearInterval(checkFbInterval);
           if (!window.FB) console.warn('FB SDK check timed out');
           resolve(); // Resolve anyway to avoid blocking?
       }, 3000);
       return; 
    }

    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = "https://connect.facebook.net/nl_NL/sdk.js";
      js.onerror = (error) => { 
         console.error('Error loading Facebook SDK script:', error);
         // Resolve anyway? Or should we reject?
         resolve(); // Let's resolve to avoid blocking the Promise.all
      };
      if (fjs && fjs.parentNode) {
        fjs.parentNode.insertBefore(js, fjs);
      }
      js.onload = () => {
        // Use a slight delay potentially for FB.init
        setTimeout(() => {
          if (window.FB) {
            try {
              window.FB.init({
                version: 'v13.0',
                xfbml: true,
                status: true,
                cookie: true,
                autoLogAppEvents: true
              });
              resolve();
            } catch (initError) {
               console.error('Error initializing Facebook SDK:', initError);
               resolve(); // Resolve anyway?
            }
          } else {
             console.error('Facebook SDK loaded but window.FB not found.');
             resolve(); // Resolve anyway?
          }
        }, 50); // Small delay
      };
    }(document, 'script', 'facebook-jssdk'));
  });
};

let instagramScriptLoadingPromise: Promise<void> | null = null;
let instagramScriptLoaded = false;

export const loadInstagramEmbed = (): Promise<void> => {
  if (instagramScriptLoaded) {
    return Promise.resolve();
  }
  if (instagramScriptLoadingPromise) {
    return instagramScriptLoadingPromise;
  }

  instagramScriptLoadingPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>('script[src="https://www.instagram.com/embed.js"]');
    if (existingScript) {
      if (window.instgrm) {
        instagramScriptLoaded = true;
        resolve();
      } else {
        console.error('Existing Instagram script tag found, but window.instgrm is missing. Assuming failure.');
        reject(new Error('Existing Instagram script tag found but failed to initialize window.instgrm'));
      }
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setTimeout(() => {
        if (window.instgrm) {
          instagramScriptLoaded = true;
          resolve();
        } else {
          console.error('window.instgrm still not found after load and short delay.');
          reject(new Error('Failed to initialize window.instgrm after loading embed.js'));
        }
      }, 50);
    };
    script.onerror = (error) => {
      console.error('Error loading newly added Instagram embed script:', error);
      instagramScriptLoadingPromise = null;
      reject(new Error('Failed to load Instagram embed.js script'));
    };
    document.body.appendChild(script);
  });

  instagramScriptLoadingPromise.finally(() => {
      instagramScriptLoadingPromise = null;
  });
  return instagramScriptLoadingPromise;
};

export default {
  loadFacebookSDK,
  loadInstagramEmbed
}; 