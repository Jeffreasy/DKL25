export const loadInstagramEmbed = () => {
  const script = document.createElement('script');
  script.src = '//www.instagram.com/embed.js';
  script.async = true;
  document.body.appendChild(script);
}; 