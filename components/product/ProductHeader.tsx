import Typography from '@/components/ui/custom-typography';
import { COLORS } from '@/constants/colors';
import { useLocal } from '@/hooks/use-lang';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

interface ProductHeaderProps {
  onBackPress?: () => void;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ onBackPress }) => {
  const router = useRouter();
  const { t } = useLocal();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.headerButton} onPress={handleBackPress}>
        <Ionicons name="arrow-back" size={24} color={COLORS.black} />
      </TouchableOpacity>
      <Typography
        title={t('home.eyeGlasses')}
        fontSize={scale(18)}
        fontFamily="Poppins-Bold"
        color={COLORS.black}
        style={styles.headerTitle}
      />
      <View style={styles.headerButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(6),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(10),
    backgroundColor: COLORS.white,
  },
  headerButton: {
    width: scale(40),
    height: scale(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontWeight: '600',
  },
});

export default ProductHeader;

