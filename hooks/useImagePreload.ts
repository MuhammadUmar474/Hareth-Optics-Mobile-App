import { imageCache } from '@/utils/imageCache';
import { useEffect, useState } from 'react';

interface UseImagePreloadOptions {
  urls: string[];
  priority?: 'low' | 'normal' | 'high';
  enabled?: boolean;
}

export const useImagePreload = (options: UseImagePreloadOptions) => {
  const { urls, priority = 'normal', enabled = true } = options;
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadError, setPreloadError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || urls.length === 0) return;

    const preloadImages = async () => {
      setIsPreloading(true);
      setPreloadError(null);

      try {
        await imageCache.preloadImages({
          urls,
          priority,
          cache: 'immutable',
        });
      } catch (error) {
        setPreloadError(error instanceof Error ? error.message : 'Failed to preload images');
        console.error('Image preload error:', error);
      } finally {
        setIsPreloading(false);
      }
    };

    preloadImages();
  }, [urls, priority, enabled]);

  return {
    isPreloading,
    preloadError,
    isImageCached: (url: string) => imageCache.isImageCached(url),
  };
};

export default useImagePreload;
