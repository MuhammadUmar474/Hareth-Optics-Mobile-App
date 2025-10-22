import { COLOR_MAP } from '@/constants/colors';
import { ProductDetailResponse } from '@/services/home/homeApi';
import { useCallback, useMemo } from 'react';

interface ColorData {
  colorValue: string;
  firstImageIndex: number;
  variantId: string;
  variantTitle: string;
}

export const useProductVariants = (product: ProductDetailResponse['product'] | null) => {
  // Helper function to get color from variant options
  const getColorFromVariant = useCallback((variant: any) => {
    const colorKeywords = ['color', 'colour', 'frame', 'finish', 'material'];
    
    const colorOption = variant.selectedOptions.find((option: any) =>
      colorKeywords.some((keyword) =>
        option.name.toLowerCase().includes(keyword)
      )
    );
    
    return colorOption?.value || null;
  }, []);

  // Helper function to map color names to hex values
  const getColorHex = useCallback((colorName: string) => {
    const color = colorName.toLowerCase().trim();

    if (COLOR_MAP[color]) return COLOR_MAP[color];

    const colorParts = color.split(' ').filter((part) => part.length > 0);
    for (const part of colorParts) {
      if (COLOR_MAP[part]) {
        return COLOR_MAP[part];
      }
    }

    for (const [key, value] of Object.entries(COLOR_MAP)) {
      if (color.includes(key) || key.includes(color)) {
        return value;
      }
    }

    const commonColors = [
      'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink',
      'brown', 'black', 'white', 'gray', 'grey', 'silver', 'gold',
    ];
    
    for (const commonColor of commonColors) {
      if (color.includes(commonColor)) {
        return COLOR_MAP[commonColor] || '#000000';
      }
    }

    if (color.startsWith('#') && color.length === 7) return color;

    // Generate a color based on the string hash
    const hash = color.split('').reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    const hue = Math.abs(hash) % 360;
    const saturation = 60 + (Math.abs(hash) % 40);
    const lightness = 40 + (Math.abs(hash) % 30);
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }, []);

  // Helper function to find image index for a variant's image URL
  const findImageIndex = useCallback(
    (imageUrl: string) => {
      if (!product) return 0;
      return product.images.edges.findIndex(
        ({ node }) => node.url === imageUrl
      );
    },
    [product]
  );

  // Get unique colors from variants with proper image mapping
  const uniqueColors = useMemo((): ColorData[] => {
    if (!product) return [];

    const uniqueColorsMap = new Map();
    product.variants.edges.forEach(({ node: variant }) => {
      const colorValue = getColorFromVariant(variant);
      if (colorValue && !uniqueColorsMap.has(colorValue)) {
        const imageIndex = variant.image
          ? findImageIndex(variant.image.url)
          : 0;

        uniqueColorsMap.set(colorValue, {
          colorValue,
          firstImageIndex: imageIndex >= 0 ? imageIndex : 0,
          variantId: variant.id,
          variantTitle: variant.title,
        });
      }
    });

    return Array.from(uniqueColorsMap.values());
  }, [product, getColorFromVariant, findImageIndex]);

  return {
    getColorFromVariant,
    getColorHex,
    uniqueColors,
  };
};

