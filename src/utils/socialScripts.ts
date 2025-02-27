export const loadInstagramEmbed = () => {
  // Instagram
  const instagramScript = document.createElement('script');
  instagramScript.src = '//www.instagram.com/embed.js';
  instagramScript.async = true;
  document.body.appendChild(instagramScript);

  // Facebook
  const facebookScript = document.createElement('script');
  facebookScript.src = 'https://connect.facebook.net/nl_NL/sdk.js';
  facebookScript.async = true;
  facebookScript.defer = true;
  facebookScript.crossOrigin = "anonymous";
  facebookScript.onload = () => {
    window.FB?.init({
      appId: '', // Leeg laten als je geen app ID hebt
      xfbml: true,
      version: 'v18.0'
    });
  };
  document.body.appendChild(facebookScript);

  return () => {
    // Cleanup
    document.body.removeChild(instagramScript);
    document.body.removeChild(facebookScript);
  };
}; 