// useScrollStyles.js
import { useLocal } from '@/hooks/use-lang';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

export const useDynamicStyles = () => {
  const { isRtl } = useLocal();

  const dynstyles = useMemo(
    () =>
      StyleSheet.create({
        horizontal: {
          flexDirection: isRtl ? 'row-reverse' : 'row', // Force LTR (row) for Arabic users
        },
        flipHoriz:{ transform: isRtl ?[{ scaleX: -1 }]: [{ scaleX: 1 }]}, // Flip horizontally
        textAlignment:{
            textAlign:isRtl?"right":"left"
        },
        alignSelf:{
            alignSelf:isRtl?"flex-end":"flex-start"
        }
      }),
    [isRtl]
  );

  return dynstyles;
};