import { ProductDetailResponse } from '@/services/home/homeApi';
import { useCallback, useRef, useState } from 'react';
import { Dimensions, ScrollView } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const useProductImageCarousel = (product: ProductDetailResponse['product'] | null) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const scrollToImage = useCallback((imageIndex: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: imageIndex * SCREEN_WIDTH,
        animated: true,
      });
    }
  }, []);

  const handleScroll = useCallback((event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentImageIndex(index);
  }, []);

  return {
    scrollViewRef,
    currentImageIndex,
    scrollToImage,
    handleScroll,
    SCREEN_WIDTH,
  };
};

