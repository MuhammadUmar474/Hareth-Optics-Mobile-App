import ContactRow from "@/components/profile/contact-row";
import HelpTopicCard from "@/components/profile/help-topic-card";
import Typography from "@/components/ui/custom-typography";
import { Header } from "@/components/ui/header";
import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const HelpCenter: React.FC = () => {
  const [query] = useState("");

  const questions = useMemo(
    () => [
      {
        question: "How long does delivery take?",
        answer:
          "Standard delivery takes 3-5 business days. Express delivery is available for 1-2 business days.",
      },
      {
        question: "Can I return prescription lenses?",
        answer:
          "Yes, you can return prescription lenses within 30 days of purchase if they are in original condition.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Currently we only ship within Kuwait. International shipping will be available soon.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept Visa, Mastercard, KNET, Apple Pay, and Tabby for your convenience.",
      },
      {
        question: "How do I submit my prescription?",
        answer:
          "You can upload your prescription during checkout or send it to us via email after placing your order.",
      },
    ],
    []
  );

  const filteredQuestions = useMemo(() => {
    if (!query.trim()) return questions;
    const q = query.toLowerCase();
    return questions.filter((item) => item.question.toLowerCase().includes(q));
  }, [query, questions]);

  return (
    <View style={styles.container}>
      <Header title="Help Center" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <Typography
            title="Frequently Asked Questions"
            fontSize={SIZES.h2}
            style={styles.sectionTitle}
          />
        </View>

        <View style={styles.questionsContainer}>
          {filteredQuestions.map((item, idx) => (
            <HelpTopicCard
              key={`${item.question}-${idx}`}
              question={item.question}
              answer={item.answer}
            />
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
  questionsContainer: {
    marginTop: SIZES.padding,
  },
  contactCard: {
    marginTop: SIZES.padding * 2,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.primary10,
    padding: SIZES.padding,
  },
});
