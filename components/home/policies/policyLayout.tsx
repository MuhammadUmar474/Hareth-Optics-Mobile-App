import { Header } from '@/components/ui/header';
import { COLORS } from '@/constants/colors';
import { Foundation } from '@expo/vector-icons';
import React, { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { verticalScale } from 'react-native-size-matters';

interface PolicyLayoutProps {
  title: string;
  heroTitle: string;
  heroSubtitle: string;
  heroIcon?: ReactNode;
  children: ReactNode;
}

const PolicyLayout = ({ 
  title, 
  heroTitle, 
  heroSubtitle, 
  heroIcon,
  children 
}: PolicyLayoutProps) => {
  return (
    <View style={styles.container}>
      <Header title={title} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.iconContainer}>
            {heroIcon || <Foundation name="shield" size={32} color={COLORS.primary} />}
          </View>
          <Text style={styles.heroTitle}>{heroTitle}</Text>
          <Text style={styles.heroSubtitle}>{heroSubtitle}</Text>
        </View>

        {/* Content */}
        {children}
      </ScrollView>
    </View>
  );
};

export default PolicyLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FC',
  },
  scrollContent: {
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(40),
    paddingHorizontal: verticalScale(20),
    flexGrow: 1,
  },
  heroSection: {
    backgroundColor: COLORS.primary2,
    paddingVertical: verticalScale(30),
    borderRadius: 16,
    marginBottom: verticalScale(20),
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A2E44',
    marginBottom: verticalScale(8),
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#6B7C8C',
    textAlign: 'center',
    lineHeight: verticalScale(20),
    paddingHorizontal: verticalScale(20),
  },
});