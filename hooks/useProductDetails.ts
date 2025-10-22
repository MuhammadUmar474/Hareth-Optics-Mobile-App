import { homeApi, ProductDetailResponse } from '@/services/home/homeApi';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

export const useProductDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetailResponse['product'] | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProductDetails = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await homeApi.getProductById(id);
      setProduct(response.product);
    } catch (error) {
      console.error('Failed to fetch product details:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  return {
    product,
    loading,
    refetch: fetchProductDetails,
  };
};

