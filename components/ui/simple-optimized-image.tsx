import { Image } from 'expo-image';
import React from 'react';
import { ImageStyle, StyleProp } from 'react-native';

interface SimpleOptimizedImageProps {
  source: { uri: string } | number;
  style?: StyleProp<ImageStyle>;
  contentFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  placeholder?: string;
  fallback?: string;
  onLoad?: () => void;
  onError?: () => void;
  priority?: 'high' | 'normal' | 'low';
}

const SimpleOptimizedImage: React.FC<SimpleOptimizedImageProps> = ({
  source,
  style,
  contentFit = 'cover',
  placeholder,
  fallback,
  onLoad,
  onError,
  priority = 'normal',
}) => {
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
      transition={200}
    />
  );
};

export default SimpleOptimizedImage;
