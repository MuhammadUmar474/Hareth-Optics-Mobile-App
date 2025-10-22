// components/policy/PolicyAccordion.tsx
import { COLORS } from '@/constants/colors';
import { Feather } from '@expo/vector-icons';
import React, { ReactNode, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { verticalScale } from 'react-native-size-matters';

interface AccordionSection {
  key: string;
  title: string;
  icon: ReactNode;
  content: ReactNode;
}

interface CustomAccordionProps {
  sections: AccordionSection[];
  defaultExpanded?: string;
}

const CustomAccordion = ({ sections, defaultExpanded }: CustomAccordionProps) => {
  const [expandedSections, setExpandedSections] = useState(() => {
    const initial: Record<string, boolean> = {};
    sections.forEach(section => {
      initial[section.key] = section.key === defaultExpanded;
    });
    return initial;
  });

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => {
      const isAlreadyOpen = prev[key];
      const allClosed = Object.keys(prev).reduce((acc, k) => {
        acc[k] = false;
        return acc;
      }, {} as Record<string, boolean>);
      return { ...allClosed, [key]: !isAlreadyOpen };
    });
  };

  return (
    <>
      {sections.map((section) => (
        <View key={section.key} style={styles.accordionCard}>
          <TouchableOpacity
            style={styles.accordionHeader}
            onPress={() => toggleSection(section.key)}
            activeOpacity={0.7}
          >
            <View style={styles.accordionIconCircle}>{section.icon}</View>
            <Text style={styles.accordionTitle}>{section.title}</Text>
            <Feather
              name={expandedSections[section.key] ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={COLORS.primary}
            />
          </TouchableOpacity>
          {expandedSections[section.key] && (
            <View style={styles.accordionContent}>{section.content}</View>
          )}
        </View>
      ))}
    </>
  );
};

export default CustomAccordion;

const styles = StyleSheet.create({
  accordionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: verticalScale(12),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: verticalScale(16),
  },
  accordionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A2E44',
    flex: 1,
  },
  accordionContent: {
    paddingHorizontal: verticalScale(16),
    paddingBottom: verticalScale(16),
    paddingLeft: verticalScale(68),
  },
});