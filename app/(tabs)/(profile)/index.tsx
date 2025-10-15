import GiftCard from "@/components/profile/gift-card";
import MembershipCard from "@/components/profile/membership-card";
import ProfileCard from "@/components/profile/profile-card";
import ProfileRow from "@/components/profile/profile-row";
import Button from "@/components/ui/custom-button";
import Typography from "@/components/ui/custom-typography";
import { Header } from "@/components/ui/header";
import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import { useLangStore } from "@/store/langStore";
import { styles } from "@/styles/profile/profile";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";

const Profile = () => {
  const { t, i18n } = useTranslation();
  const language = useLangStore((s) => s.language);
  const setLanguage = useLangStore((s) => s.setLanguage);

  const localizedSettings = useMemo(
    () => [
      // {
      //   title: t("profile.menu.trackOrder"),
      //   iconName: "truck",
      //   link: "/track-order",
      // },
      // {
      //   title: t("profile.menu.gold"),
      //   iconName: "star",
      //   link: "/hareth-gold-membership",
      // },
      // {
      //   title: t("profile.menu.giftBalance"),
      //   iconName: "gift",
      //   link: "/view-gift-card-balance",
      // },
      // {
      //   title: t("profile.menu.savedPayments"),
      //   iconName: "credit-card",
      //   link: "/saved-payment-methods",
      // },
      {
        title: t("profile.menu.addressBook"),
        iconName: "bookmark",
        link: "/address-book",
      },
      {
        title: t("profile.menu.accountInfo"),
        iconName: "user",
        link: "/account-info",
      },
      {
        title: t("profile.menu.prescriptions"),
        iconName: "file-text",
        link: "/my-prescriptions",
      },
      {
        title: t("profile.menu.submitEyePower"),
        iconName: "eye",
        link: "/submit-eye-power",
      },
      {
        title: t("profile.menu.eyeTestHome"),
        iconName: "home",
        link: "/eye-test-at-home",
      },
      {
        title: t("profile.menu.storeLocator"),
        iconName: "navigation",
        link: "/store-locator",
      },
      {
        title: t("profile.menu.referEarn"),
        iconName: "users",
        link: "/refer-and-earn",
      },
      {
        title: t("profile.menu.helpCenter"),
        iconName: "help-circle",
        link: "/help-center",
      },
      {
        title: t("profile.menu.contactUs"),
        iconName: "phone",
        link: "/contact-us",
      },
    ],
    [t]
  );

  const toggleLanguage = async () => {
    const next = language === "en" ? "ar" : "en";

    await i18n.changeLanguage(next);
    setLanguage(next);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Header title={t("common.profile")} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}
      >
        <View
          style={{
            paddingHorizontal: SIZES.caption,
            marginTop: 10,
            marginBottom: 10,
            alignSelf: "flex-end",
          }}
        >
          <Button
            color="primary"
            onPress={toggleLanguage}
            style={{ borderRadius: 10 }}
          >
            <Typography
              title={
                language === "en" ? t("common.arabic") : t("common.english")
              }
              fontSize={SIZES.desc}
              style={{ fontWeight: "700", color: COLORS.white }}
            />
          </Button>
        </View>
        <ProfileCard />

        <MembershipCard />
        <GiftCard />
        <View style={styles.container}>
          <Typography
            title={t("common.settingsAndServices")}
            fontSize={16}
            fontFamily="Poppins-Bold"
            style={{
              marginBottom: SIZES.padding,
              alignSelf: language === "ar" ? "flex-end" : "flex-start",
              fontWeight: "bold",
            }}
          />
          {localizedSettings.map((item: any, index: number) => (
            <ProfileRow
              Title={item.title}
              iconName={item.iconName}
              key={index}
              onPress={() => {
                router.push(item.link);
              }}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
