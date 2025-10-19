import FastImage, { Priority, Source } from "react-native-fast-image";

export interface ImageCacheConfig {
  urls: string[];
  priority?: Priority;
  cache?: "immutable" | "web" | "memory";
}

class ImageCacheManager {
  private static instance: ImageCacheManager;
  private preloadedImages: Set<string> = new Set();

  static getInstance(): ImageCacheManager {
    if (!ImageCacheManager.instance) {
      ImageCacheManager.instance = new ImageCacheManager();
    }
    return ImageCacheManager.instance;
  }

  /**
   * Preload images for better performance
   */
  async preloadImages(config: ImageCacheConfig): Promise<void> {
    const { urls, priority = "normal", cache = "immutable" } = config;

    const validUrls = urls.filter((url) => {
      if (!url || typeof url !== "string") return false;
      if (this.preloadedImages.has(url)) return false;
      return true;
    });

    if (validUrls.length === 0) return;

    try {
      // Check if FastImage is available and working
      if (!FastImage || typeof FastImage.preload !== "function") {
        console.warn("⚠️ FastImage not available, skipping preload");
        return;
      }

        const preloadResult = await FastImage.preload(
          validUrls.map((url): Source => ({
            uri: url,
            priority,
            cache: cache as any,
          }))
        );

      // Check if preload was successful
      if (preloadResult === null || preloadResult === undefined) {
        console.warn("⚠️ FastImage.preload returned null, skipping preload");
        return;
      }

      // Mark as preloaded
      validUrls.forEach((url) => this.preloadedImages.add(url));

      console.log(`✅ Preloaded ${validUrls.length} images`);
    } catch (error: unknown) {
      console.error("❌ Failed to preload images:", error);
      // Continue execution even if preload fails
    }
  }

  /**
   * Preload images for a specific component
   */
  async preloadComponentImages(imageUrls: string[]): Promise<void> {
    await this.preloadImages({
      urls: imageUrls,
      priority: "high",
      cache: "immutable",
    });
  }

  /**
   * Clear cache (useful for memory management)
   */
  clearCache(): void {
    try {
      if (FastImage && typeof FastImage.clearMemoryCache === "function") {
        FastImage.clearMemoryCache();
      }
      if (FastImage && typeof FastImage.clearDiskCache === "function") {
        FastImage.clearDiskCache();
      }
      this.preloadedImages.clear();
      console.log("🧹 Image cache cleared");
    } catch (error: unknown) {
      console.warn("⚠️ Failed to clear cache:", error);
    }
  }

  /**
   * Get cache size info (not available in current FastImage version)
   */
  async getCacheInfo(): Promise<{ memory: number; disk: number }> {
    // FastImage.getCacheSize is not available in the current version
    console.warn("⚠️ Cache size info not available in current FastImage version");
    return { memory: 0, disk: 0 };
  }

  /**
   * Check if image is cached
   */
  isImageCached(url: string): boolean {
    return this.preloadedImages.has(url);
  }

  /**
   * Preload critical images on app start
   */
  async preloadCriticalImages(): Promise<void> {
    const criticalImages = [
      // Add your critical images here (logos, splash screens, etc.)
      "https://via.placeholder.com/100x100/000000/FFFFFF?text=Logo",
      "https://via.placeholder.com/200x200/000000/FFFFFF?text=Splash",
    ];

    await this.preloadImages({
      urls: criticalImages,
      priority: "high",
      cache: "immutable",
    });
  }
}

export const imageCache = ImageCacheManager.getInstance();
export default imageCache;
