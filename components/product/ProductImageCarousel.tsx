import Typography from '@/components/ui/custom-typography';
import { COLORS } from '@/constants/colors';
import { ProductDetailResponse } from '@/services/home/homeApi';
import { Image } from 'expo-image';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

interface ProductImageCarouselProps {
  product: ProductDetailResponse['product'];
  scrollViewRef: React.RefObject<ScrollView>;
  currentImageIndex: number;
  onScroll: (event: any) => void;
  screenWidth: number;
}

const ProductImageCarousel: React.FC<ProductImageCarouselProps> = ({
  product,
  scrollViewRef,
  currentImageIndex,
  onScroll,
  screenWidth,
}) => {
  return (
    <View style={styles.imageSection}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {product.images.edges.map(({ node: image }, index) => (
          <View key={index} style={[styles.imageContainer, { width: screenWidth }]}>
            <Image
              source={{ uri: image.url }}
              style={styles.productImage}
              contentFit="cover"
            />
          </View>
        ))}
      </ScrollView>

      {/* Image Counter Badge */}
      <View style={styles.imageCounter}>
        <Typography
          title={`${currentImageIndex + 1}/${product.images.edges.length}`}
          fontSize={scale(14)}
          color={COLORS.white}
          fontFamily="Roboto-Bold"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageSection: {
    height: verticalScale(300),
    backgroundColor: COLORS.grey3,
    position: 'relative',
  },
  imageContainer: {
    height: verticalScale(300),
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  imageCounter: {
    position: 'absolute',
    bottom: verticalScale(20),
    alignSelf: 'center',
    backgroundColor: COLORS.grey16,
    paddingHorizontal: scale(13),
    paddingVertical: verticalScale(5),
    borderRadius: scale(40),
  },
});

export default ProductImageCarousel;

