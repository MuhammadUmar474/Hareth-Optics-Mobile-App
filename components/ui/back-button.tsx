import { COLORS } from '@/constants/colors';
import { useLocal } from '@/hooks/use-lang';
import { Ionicons } from '@expo/vector-icons';
import { goBack } from 'expo-router/build/global-state/routing';
import React, { useMemo } from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { moderateScale, scale } from 'react-native-size-matters';

interface BackButtonProps {
  style?: StyleProp<ViewStyle>;
  onAction?: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ style, onAction }) => {
  const { isRtl } = useLocal();

  const dynamicStyles = useMemo(
    () =>
      StyleSheet.create({
        backButton: {
          width: scale(40),
          height: scale(30),
          borderRadius: scale(10),
          alignItems: 'center',
          borderColor: COLORS.grey20,
          borderWidth: 1,
          justifyContent: 'center',
          left: isRtl ? scale(-10) : scale(10),
          alignSelf: isRtl ? 'flex-end' : 'flex-start',
        },
      }),
    [isRtl]
  );

  const handlePress = () => {
    goBack();
    if (onAction) {
      onAction();
    }
  };

  return (
    <TouchableOpacity
      style={[dynamicStyles.backButton, style]}
      onPress={handlePress}
    >
      <Ionicons
        name={isRtl ? 'arrow-forward' : 'arrow-back'}
        size={moderateScale(24)}
        color={COLORS.secondary}
      />
    </TouchableOpacity>
  );
};

export default BackButton;