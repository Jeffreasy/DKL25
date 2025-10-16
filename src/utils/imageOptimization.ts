/**
 * Image Optimization Utilities
 * Cloudinary image optimization with automatic format selection and responsive sizing
 */

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'scale' | 'crop' | 'fit' | 'thumb';
  quality?: 'auto' | number;
  format?: 'auto' | 'jpg' | 'png' | 'webp' | 'avif' | 'jpeg-xl';
  gravity?: 'auto' | 'face' | 'center';
  dpr?: 'auto' | number;
  flags?: string[];
}

/**
 * Generate optimized Cloudinary image URL with automatic format selection
 * Uses f_auto for automatic format selection based on browser support
 */
export const getOptimizedImageUrl = (
  publicId: string,
  options: ImageOptimizationOptions = {}
): string => {
  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
    gravity = 'auto',
    dpr = 'auto',
    flags = []
  } = options;

  // Base Cloudinary URL
  const baseUrl = 'https://res.cloudinary.com/dgfuv7wif/image/upload';

  // Build transformation parameters
  const transformations: string[] = [];

  // Format selection (f_auto for automatic format)
  if (format === 'auto') {
    transformations.push('f_auto');
  } else if (format) {
    transformations.push(`f_${format}`);
  }

  // Quality optimization (q_auto for automatic quality)
  if (quality === 'auto') {
    transformations.push('q_auto');
  } else if (typeof quality === 'number') {
    transformations.push(`q_${quality}`);
  }

  // Sizing and cropping
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop) transformations.push(`c_${crop}`);
  if (gravity && gravity !== 'auto') transformations.push(`g_${gravity}`);

  // Device pixel ratio
  if (dpr === 'auto') {
    transformations.push('dpr_auto');
  } else if (typeof dpr === 'number') {
    transformations.push(`dpr_${dpr}`);
  }

  // Additional flags
  flags.forEach(flag => transformations.push(`fl_${flag}`));

  // Join transformations
  const transformationString = transformations.join(',');

  return `${baseUrl}/${transformationString}/${publicId}`;
};

/**
 * Generate responsive image sources for different screen sizes
 * Returns an object with src and srcSet for responsive images
 */
export const getResponsiveImageSources = (
  publicId: string,
  baseOptions: ImageOptimizationOptions = {},
  breakpoints: { width: number; media: string }[] = [
    { width: 480, media: '(max-width: 480px)' },
    { width: 768, media: '(max-width: 768px)' },
    { width: 1024, media: '(max-width: 1024px)' },
    { width: 1280, media: '(max-width: 1280px)' },
    { width: 1920, media: '(min-width: 1281px)' }
  ]
) => {
  const sources = breakpoints.map(({ width, media }) => ({
    srcSet: getOptimizedImageUrl(publicId, { ...baseOptions, width }),
    media,
    type: 'image/webp' // Default to WebP, Cloudinary will serve appropriate format
  }));

  return {
    src: getOptimizedImageUrl(publicId, baseOptions),
    srcSet: sources.map(s => `${s.srcSet} ${s.media}`).join(', '),
    sources
  };
};

/**
 * Generate picture element sources for modern format support
 * Includes WebP, AVIF, and JPEG XL fallbacks
 */
export const getPictureSources = (
  publicId: string,
  options: ImageOptimizationOptions = {}
) => {
  const baseTransformations = [];

  // Add sizing if specified
  if (options.width) baseTransformations.push(`w_${options.width}`);
  if (options.height) baseTransformations.push(`h_${options.height}`);
  if (options.crop) baseTransformations.push(`c_${options.crop}`);
  if (options.gravity && options.gravity !== 'auto') baseTransformations.push(`g_${options.gravity}`);
  if (options.quality === 'auto') baseTransformations.push('q_auto');
  else if (typeof options.quality === 'number') baseTransformations.push(`q_${options.quality}`);

  const baseUrl = 'https://res.cloudinary.com/dgfuv7wif/image/upload';
  const transformationString = baseTransformations.join(',');

  return {
    avif: `${baseUrl}/f_avif,${transformationString}/${publicId}`,
    webp: `${baseUrl}/f_webp,${transformationString}/${publicId}`,
    'jpeg-xl': `${baseUrl}/f_jxl,${transformationString}/${publicId}`,
    fallback: `${baseUrl}/f_auto,${transformationString}/${publicId}`
  };
};

/**
 * Preload critical images for better performance
 */
export const preloadImage = (src: string, as: 'image' = 'image'): void => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = src;
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
};

/**
 * Generate thumbnail URL for lazy loading placeholders
 */
export const getThumbnailUrl = (
  publicId: string,
  size: number = 50
): string => {
  return getOptimizedImageUrl(publicId, {
    width: size,
    height: size,
    crop: 'thumb',
    quality: 70,
    format: 'auto'
  });
};

/**
 * Check if browser supports modern image formats
 */
export const checkFormatSupport = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  return {
    webp: canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0,
    avif: canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0,
  };
};

/**
 * Convert animated GIF to MP4 for better performance
 * Returns MP4 URL if the original is a GIF, otherwise returns optimized image URL
 */
export const getVideoFromGif = (publicId: string): string => {
  if (publicId.toLowerCase().endsWith('.gif')) {
    // Convert GIF to MP4 by changing extension
    const mp4Id = publicId.replace(/\.gif$/i, '.mp4');
    return `https://res.cloudinary.com/dgfuv7wif/video/upload/f_mp4,q_auto/${mp4Id}`;
  }

  // Return optimized image URL for non-GIF images
  return getOptimizedImageUrl(publicId, { format: 'auto', quality: 'auto' });
};

/**
 * Lossy compression for animated GIFs
 */
export const getLossyGifUrl = (publicId: string): string => {
  if (publicId.toLowerCase().endsWith('.gif')) {
    return `https://res.cloudinary.com/dgfuv7wif/image/upload/fl_lossy/${publicId}`;
  }
  return getOptimizedImageUrl(publicId);
};

/**
 * Batch optimize multiple images
 */
export const optimizeImageBatch = (
  publicIds: string[],
  options: ImageOptimizationOptions = {}
): string[] => {
  return publicIds.map(id => getOptimizedImageUrl(id, options));
};

/**
 * Generate Cloudinary transformation URL manually
 * For advanced use cases not covered by the helper functions
 */
export const buildTransformationUrl = (
  publicId: string,
  transformations: string[]
): string => {
  const baseUrl = 'https://res.cloudinary.com/dgfuv7wif/image/upload';
  const transformationString = transformations.join(',');
  return `${baseUrl}/${transformationString}/${publicId}`;
};