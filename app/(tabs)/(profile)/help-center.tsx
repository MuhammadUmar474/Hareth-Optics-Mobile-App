import ContactRow from "@/components/profile/contact-row";
import HelpTopicCard from "@/components/profile/help-topic-card";
import Typography from "@/components/ui/custom-typography";
import { Header } from "@/components/ui/header";
import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const HelpCenter: React.FC = () => {
  const [query, setQuery] = useState("");

  const topics = useMemo(
    () => [
      {
        label: "Orders",
        icon: "local-shipping" as const,
        route: "/(tabs)/(Profile)/orders",
      },
      {
        label: "Payments",
        icon: "payment" as const,
        route: "/(tabs)/(Profile)/saved-payment-methods",
      },
      {
        label: "Prescriptions",
        icon: "medical-services" as const,
        route: "/(tabs)/(Profile)/my-prescriptions",
      },
      {
        label: "Returns",
        icon: "assignment-return" as const,
        route: "/(tabs)/(Profile)/orders",
      },
      {
        label: "Other",
        icon: "help-outline" as const,
        route: "/(tabs)/(Profile)/help-center",
      },
    ],
    []
  );

  const filteredTopics = useMemo(() => {
    if (!query.trim()) return topics;
    const q = query.toLowerCase();
    return topics.filter((t) => t.label.toLowerCase().includes(q));
  }, [query, topics]);

  const handleTopicPress = useCallback((route: string) => {
    router.push(route as any);
  }, []);

  return (
    <View style={styles.container}>
      <Header title="Help Center" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <Typography
            title="Help Topics"
            fontSize={SIZES.h2}
            style={styles.sectionTitle}
          />
        </View>

        <View style={styles.grid}>
          {filteredTopics.map((t, idx) => (
            <View key={`${t.label}-${idx}`} style={styles.gridItem}>
              <HelpTopicCard
                label={t.label}
                iconName={t.icon}
                onPress={() => handleTopicPress(t.route)}
              />
            </View>
          ))}
        </View>

        <View style={styles.contactCard}>
          <Typography
            title="Contact Us"
            fontSize={SIZES.h2}
            style={styles.sectionTitle}
          />
          <Typography
            title="Can't find what you're looking for?"
            fontSize={SIZES.body}
            color={COLORS.grey14}
            style={{ marginTop: SIZES.base }}
          />

          <View style={{ marginTop: SIZES.padding }}>
            <ContactRow
              label="Chat with us"
              iconName="chat"
              onPress={() => {}}
            />
            <ContactRow label="Email us" iconName="email" onPress={() => {}} />
            <ContactRow label="Call us" iconName="call" onPress={() => {}} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HelpCenter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingBottom: SIZES.padding * 6,
  },
  content: { padding: SIZES.padding, paddingBottom: SIZES.padding * 2 },
  searchWrapper: { marginTop: SIZES.padding },
  sectionHeader: { marginTop: SIZES.padding * 1.5 },
  sectionTitle: { fontWeight: "700" },
  grid: {
    marginTop: SIZES.padding,
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -SIZES.base,
  },
  gridItem: {
    width: "50%",
    paddingHorizontal: SIZES.base,
    marginBottom: SIZES.base,
  },
  contactCard: {
    marginTop: SIZES.padding * 2,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.primary10,
    padding: SIZES.padding,
  },
});
