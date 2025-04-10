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
  }
}

export const loadFacebookSDK = () => {
  return new Promise<void>((resolve) => {
    // Load the SDK asynchronously
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = "https://connect.facebook.net/nl_NL/sdk.js";
      if (fjs && fjs.parentNode) {
        fjs.parentNode.insertBefore(js, fjs);
      }
      js.onload = () => {
        if (window.FB) {
          window.FB.init({
            version: 'v13.0',
            xfbml: true,
            status: true,
            cookie: true,
            autoLogAppEvents: true
          });
          resolve();
        }
      };
    }(document, 'script', 'facebook-jssdk'));
  });
};

// Module-level state for Instagram loading
let instagramScriptLoadingPromise: Promise<void> | null = null;
let instagramScriptLoaded = false;

export const loadInstagramEmbed = (): Promise<void> => {
  // If already loaded successfully, return a resolved promise immediately
  if (instagramScriptLoaded) {
    console.log('Instagram script already marked as loaded successfully.');
    return Promise.resolve();
  }

  // If currently loading, return the existing promise
  if (instagramScriptLoadingPromise) {
    console.log('Instagram script is currently loading, returning existing promise.');
    return instagramScriptLoadingPromise;
  }

  // Start loading
  console.log('Starting Instagram script loading process...');
  instagramScriptLoadingPromise = new Promise<void>((resolve, reject) => {
    // Check if script tag exists (maybe added outside this function or in a previous failed attempt)
    let script = document.querySelector<HTMLScriptElement>('script[src="https://www.instagram.com/embed.js"]');

    if (script) {
        console.log('Instagram script tag already exists in DOM.');
        // If tag exists, check if window.instgrm is already there
        if (window.instgrm) {
            console.log('window.instgrm found with existing script tag.');
            instagramScriptLoaded = true;
            resolve();
            return;
        } else {
            // Tag exists, but object doesn't. Maybe it's still loading or failed?
            // We'll rely on the onload/onerror of the *original* script addition if possible,
            // or add new handlers if needed, but this case is tricky.
            // For now, let's assume the original load will eventually resolve or reject.
            // To be safe, let's re-attach handlers or wait.
            console.warn('Existing Instagram script tag found, but window.instgrm missing. Waiting for potential load/error...');
            
            const handleExistingLoad = () => {
                console.log('Existing Instagram script onload fired.');
                if (window.instgrm) {
                    instagramScriptLoaded = true;
                    resolve();
                } else {
                    console.error('Existing script onload fired, but window.instgrm still missing.');
                    reject(new Error('Existing Instagram script failed to initialize window.instgrm'));
                }
                // Clean up listeners if we added them
                script?.removeEventListener('load', handleExistingLoad);
                script?.removeEventListener('error', handleExistingError);
            };
            const handleExistingError = (event: Event | string) => {
                console.error('Existing Instagram script onerror fired:', event);
                reject(new Error('Existing Instagram script failed to load'));
                // Clean up listeners if we added them
                script?.removeEventListener('load', handleExistingLoad);
                script?.removeEventListener('error', handleExistingError);
            };

            // Re-attach listeners just in case they were lost
            script.addEventListener('load', handleExistingLoad);
            script.addEventListener('error', handleExistingError);

            // Add a timeout as a final fallback
            setTimeout(() => {
              if (!instagramScriptLoaded) {
                  if(window.instgrm) {
                      console.log('window.instgrm appeared after fallback timeout for existing script.');
                      instagramScriptLoaded = true;
                      resolve();
                  } else {
                     console.error('Fallback timeout reached for existing script, window.instgrm still missing.');
                     reject(new Error('Timeout waiting for existing Instagram script to initialize'));
                  }
              }
            }, 2000); // 2 second timeout fallback
            return; // Let the event handlers or timeout handle resolution/rejection
        }
    }

    // If script tag doesn't exist, create and append it
    console.log('Creating and appending Instagram embed script...');
    script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log('Newly added Instagram script onload event fired.');
      // Use a small timeout to increase chance window.instgrm is ready
      setTimeout(() => {
        if (window.instgrm) {
            console.log('window.instgrm found after load and short delay.');
            instagramScriptLoaded = true;
            resolve();
        } else {
            console.error('window.instgrm still not found after load and short delay.');
            reject(new Error('Failed to initialize window.instgrm after loading embed.js'));
        }
      }, 50); // 50ms delay - shorter than before, just a tick
    };

    script.onerror = (error) => {
      console.error('Error loading newly added Instagram embed script:', error);
      instagramScriptLoadingPromise = null; // Reset promise state on failure
      reject(new Error('Failed to load Instagram embed.js script'));
    };

    document.body.appendChild(script);
  });

  // Clean up promise reference once loading is complete (success or fail)
  instagramScriptLoadingPromise.finally(() => {
      instagramScriptLoadingPromise = null;
  });

  return instagramScriptLoadingPromise;
};

export default {
  loadFacebookSDK,
  loadInstagramEmbed
}; 