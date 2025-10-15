import ContactAction from "@/components/profile/ContactAction";
import Typography from "@/components/ui/custom-typography";
import { Header } from "@/components/ui/header";
import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import React, { useCallback } from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const ContactUs: React.FC = () => {
  const handleCall = useCallback(() => {
    Linking.openURL("+1234567890");
  }, []);

  const handleEmail = useCallback(() => {
    Linking.openURL("support@harethoptics.com");
  }, []);

  const handleChat = useCallback(() => {
    Linking.openURL("https://harethoptics.com/chat");
  }, []);

  const openUrl = useCallback((url: string) => {
    Linking.openURL(url);
  }, []);

  return (
    <View style={styles.container}>
      <Header title="Contact Us" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Typography
          title="How can we help?"
          fontSize={SIZES.h2}
          color={COLORS.secondary}
          fontFamily="Inter-Bold"
          style={styles.sectionTitle}
        />

        <View style={styles.actionsList}>
          <ContactAction
            label="Call Us"
            subtitle="Available 9am - 6pm"
            iconName="call"
            onPress={handleCall}
          />
          <ContactAction
            label="Email Us"
            subtitle="Response within 24 hours"
            iconName="email"
            onPress={handleEmail}
          />
          <ContactAction
            label="Live Chat"
            subtitle="Available 9am - 6pm"
            iconName="chat"
            onPress={handleChat}
          />
        </View>

        <Typography
          title="Follow Us"
          fontSize={SIZES.h2}
          color={COLORS.secondary}
          fontFamily="Inter-Bold"
          style={styles.followTitle}
        />

        <View style={styles.socialGrid}>
          <TouchableOpacity
            style={styles.socialItem}
            activeOpacity={0.8}
            onPress={() => openUrl("https://instagram.com/harethoptics")}
            accessibilityRole="button"
            accessibilityLabel="Instagram"
          >
            <Ionicons name="logo-instagram" size={28} color={COLORS.primary} />
            <Typography
              title="Instagram"
              fontSize={SIZES.desc}
              color={COLORS.secondary}
              style={styles.socialLabel}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialItem}
            activeOpacity={0.8}
            onPress={() => openUrl("https://twitter.com/harethoptics")}
            accessibilityRole="button"
            accessibilityLabel="Twitter"
          >
            <AntDesign name="twitter" size={26} color={COLORS.primary} />
            <Typography
              title="Twitter"
              fontSize={SIZES.desc}
              color={COLORS.secondary}
              style={styles.socialLabel}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialItem}
            activeOpacity={0.8}
            onPress={() => openUrl("https://facebook.com/harethoptics")}
            accessibilityRole="button"
            accessibilityLabel="Facebook"
          >
            <Ionicons name="logo-facebook" size={28} color={COLORS.primary} />
            <Typography
              title="Facebook"
              fontSize={SIZES.desc}
              color={COLORS.secondary}
              style={styles.socialLabel}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ContactUs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    padding: SIZES.padding,
    paddingBottom: SIZES.padding * 2,
  },
  sectionTitle: {
    marginBottom: SIZES.padding,
  },
  actionsList: {
    gap: SIZES.base,
  },
  followTitle: {
    marginTop: SIZES.h2,
    marginBottom: SIZES.padding,
  },
  socialGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
  },
  socialItem: {
    width: "31%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.primary10,
  },
  socialLabel: {
    marginTop: 6,
    fontFamily: "Inter-Medium",
  },
});
