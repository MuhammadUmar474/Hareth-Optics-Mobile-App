export const IMAGE_CONFIG = {
  CACHE_SIZE: {
    MEMORY: 50 * 1024 * 1024, // 50MB memory cache
    DISK: 200 * 1024 * 1024,  // 200MB disk cache
  },
  
  // Image quality settings
  QUALITY: {
    HIGH: 0.9,
    MEDIUM: 0.7,
    LOW: 0.5,
  },
  
  // Preload settings
  PRELOAD: {
    BATCH_SIZE: 10, // Preload 10 images at a time
    PRIORITY_THRESHOLD: 5, // Preload when 5 images are visible
  },
  
  // Fallback images
  FALLBACKS: {
    PRODUCT: 'https://via.placeholder.com/300x300/f0f0f0/999999?text=No+Image',
    AVATAR: 'https://via.placeholder.com/100x100/f0f0f0/999999?text=User',
    LOGO: 'https://via.placeholder.com/200x200/f0f0f0/999999?text=Logo',
  },
  
  // Image formats to prioritize
  PREFERRED_FORMATS: ['webp', 'jpeg', 'png'],
  
  // Network settings
  NETWORK: {
    TIMEOUT: 10000, // 10 seconds
    RETRY_ATTEMPTS: 3,
  },
};

export default IMAGE_CONFIG;
