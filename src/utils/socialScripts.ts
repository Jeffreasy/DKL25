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

export const loadInstagramEmbed = () => {
  return new Promise<void>((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
};

export default {
  loadFacebookSDK,
  loadInstagramEmbed
}; 