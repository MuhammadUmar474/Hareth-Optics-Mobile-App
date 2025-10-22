// components/policy/PolicyContent.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { verticalScale } from 'react-native-size-matters';

export const ContentText = ({ children }: { children: string }) => (
  <Text style={styles.contentText}>{children}</Text>
);

export const BulletPoint = ({ children }: { children: string }) => (
  <View style={styles.bulletPoint}>
    <View style={styles.bulletDot} />
    <Text style={styles.bulletText}>{children}</Text>
  </View>
);

const styles = StyleSheet.create({
  contentText: {
    fontSize: 14,
    color: '#6B7C8C',
    lineHeight: verticalScale(22),
    marginBottom: verticalScale(8),
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: verticalScale(8),
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#6B7C8C',
    marginTop: verticalScale(8),
    marginRight: 8,
  },
  bulletText: {
    fontSize: 14,
    color: '#6B7C8C',
    lineHeight: verticalScale(22),
    flex: 1,
  },
});