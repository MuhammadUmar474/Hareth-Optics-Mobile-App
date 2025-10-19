import { Image } from 'expo-image';
import React from 'react';
import { ImageStyle, StyleProp } from 'react-native';
import FastImage, { ImageStyle as FastImageStyle, Priority, ResizeMode } from 'react-native-fast-image';

interface OptimizedImageProps {
  source: { uri: string } | number;
  style?: StyleProp<ImageStyle>;
  contentFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  priority?: Priority;
  cache?: 'immutable' | 'web' | 'memory';
  placeholder?: string;
  fallback?: string;
  onLoad?: () => void;
  onError?: () => void;
  resizeMode?: ResizeMode;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  source,
  style,
  contentFit = 'cover',
  priority = 'normal' as Priority,
  cache = 'immutable' as 'immutable' | 'web' | 'memory',
  placeholder,
  fallback,
  onLoad,
  onError,
  resizeMode = 'cover' as ResizeMode,
}) => {
  // Check if FastImage is available and working
  const isFastImageAvailable = FastImage && typeof FastImage === 'object';

  // Use FastImage for better caching and performance (if available)
  if (typeof source === 'object' && 'uri' in source && isFastImageAvailable) {
    try {
      return (
        <FastImage
          source={{
            uri: source.uri,
            priority,
          }}
          style={style as StyleProp<FastImageStyle>}
          resizeMode={resizeMode}
          onLoad={onLoad}
          onError={onError}
        />
      );
    } catch (error) {
      console.warn('⚠️ FastImage failed, falling back to expo-image:', error);
    }
  }

  return (
    <Image
      source={source}
      style={style}
      contentFit={contentFit}
      placeholder={placeholder}
      onLoad={onLoad}
      onError={onError}
      cachePolicy="memory-disk"
      recyclingKey={typeof source === 'object' && 'uri' in source ? source.uri : undefined}
    />
  );
};

export default OptimizedImage;
