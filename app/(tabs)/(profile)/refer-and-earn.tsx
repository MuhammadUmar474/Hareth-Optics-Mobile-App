import Typography from "@/components/ui/custom-typography";
import { Header } from "@/components/ui/header";
import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import { MaterialIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import React, { useCallback, useMemo } from "react";
import {
  Linking,
  ScrollView,
  Share,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale, scale } from "react-native-size-matters";

const ReferAndEarn: React.FC = () => {
  const referralCode = useMemo(() => "HARETH-REF-458", []);
  const shareMessage = useMemo(
    () =>
      `Use my Hareth Optics referral code ${referralCode} to get a discount on your first purchase!`,
    [referralCode]
  );

  const handleCopy = useCallback(async () => {
    await Clipboard.setStringAsync(referralCode);
    try {
      await Haptics.selectionAsync();
    } catch {}
  }, [referralCode]);

  const handleShareSystem = useCallback(async () => {
    try {
      await Share.share({ message: shareMessage });
    } catch {}
  }, [shareMessage]);

  const handleShareWhatsApp = useCallback(async () => {
    const url = `whatsapp://send?text=${encodeURIComponent(shareMessage)}`;
    const can = await Linking.canOpenURL(url);
    if (can) Linking.openURL(url);
    else handleShareSystem();
  }, [shareMessage, handleShareSystem]);

  const handleShareSMS = useCallback(async () => {
    const body = encodeURIComponent(shareMessage);
    const url = `sms:&body=${body}`;
    const can = await Linking.canOpenURL(url);
    if (can) Linking.openURL(url);
    else handleShareSystem();
  }, [shareMessage, handleShareSystem]);

  const handleShareEmail = useCallback(async () => {
    const subject = encodeURIComponent("Join Hareth Optics and save!");
    const body = encodeURIComponent(shareMessage);
    const url = `mailto:?subject=${subject}&body=${body}`;
    const can = await Linking.canOpenURL(url);
    if (can) Linking.openURL(url);
    else handleShareSystem();
  }, [shareMessage, handleShareSystem]);

  return (
    <View style={styles.container}>
      <Header title="Refer & Earn" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Typography
            title="Invite friends, earn rewards"
            fontSize={SIZES.h1}
            style={styles.heroTitle}
          />
          <Typography
            title="Share your unique referral code. When your friends make their first purchase, you both get a discount."
            fontSize={SIZES.desc}
            color={COLORS.grey14}
            style={styles.heroSubtitle}
          />
        </View>

        <View style={styles.section}>
          <Typography
            title="Your Referral Code"
            fontSize={SIZES.h3}
            style={styles.sectionTitle}
          />
          <View style={styles.codeRow}>
            <TextInput
              value={referralCode}
              editable={false}
              selectTextOnFocus={false}
              style={styles.codeInput}
            />
            <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
              <MaterialIcons
                name="content-copy"
                size={20}
                color={COLORS.white}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareBtn}>
              <MaterialIcons name="share" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* TODO: maybe need in future */}
        {/* <View style={styles.section}>
          <Typography
            title="Share Your Code"
            fontSize={SIZES.h3}
            style={styles.sectionTitle}
          />
          <View style={styles.shareGrid}>
            <ShareItem
              label="WhatsApp"
              icon={
                <Ionicons
                  name="logo-whatsapp"
                  size={24}
                  color={COLORS.primary}
                />
              }
              onPress={handleShareWhatsApp}
            />
            <ShareItem
              label="SMS"
              icon={
                <Ionicons name="chatbubble" size={22} color={COLORS.primary} />
              }
              onPress={handleShareSMS}
            />
            <ShareItem
              label="Email"
              icon={<Ionicons name="mail" size={22} color={COLORS.primary} />}
              onPress={handleShareEmail}
            />
            <ShareItem
              label="More"
              icon={
                <Ionicons
                  name="share-outline"
                  size={22}
                  color={COLORS.primary}
                />
              }
              onPress={handleShareSystem}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Typography
            title="Referral Status"
            fontSize={SIZES.h3}
            style={styles.sectionTitle}
          />
          <View style={styles.statsCard}>
            <StatRow label="Invites Sent" value="5" />
            <Divider />
            <StatRow label="Sign-ups" value="3" />
            <Divider />
            <StatRow label="Successful Purchases" value="2" />
            <Divider />
            <StatRow label="Earned Rewards" value="$20" highlight />
          </View>
        </View> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingBottom: SIZES.padding * 6,
  },
  content: { padding: SIZES.padding, paddingBottom: SIZES.padding * 2 },
  hero: { alignItems: "center", paddingVertical: SIZES.padding },
  heroTitle: { fontWeight: "800", textAlign: "center" },
  heroSubtitle: { marginTop: SIZES.base, textAlign: "center", width: "90%" },
  section: { marginTop: SIZES.padding * 1.5 },
  sectionTitle: { fontWeight: "700", marginBottom: SIZES.base },
  codeRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: SIZES.radius,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.grey20,
  },
  codeInput: {
    flex: 1,
    paddingVertical: SIZES.padding,
    paddingHorizontal: SIZES.padding,
    fontFamily: "Inter-Bold",
    fontSize: SIZES.h3,
    letterSpacing: 2,
    color: COLORS.secondary,
    backgroundColor: COLORS.white,
  },
  copyBtn: {
    height: 44,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: moderateScale(8),
    marginHorizontal: scale(2),
  },
  shareBtn: {
    height: 44,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: moderateScale(8),
    marginHorizontal: scale(2),
  },
  shareGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SIZES.base,
  },
  statsCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.grey20,
  },
});

export default ReferAndEarn;
