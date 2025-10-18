import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import { useLangStore } from "@/store/langStore";
import { useAuthStore } from "@/store/shopifyStore";
import { logoutUser } from "@/utils/auth";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Button from "../ui/custom-button";
import Typography from "../ui/custom-typography";

const ProfileCard = () => {
  const { t } = useTranslation();
  const lang = useLangStore((state) => state.language);
  const rtl = lang === "ar";
  const { isAuthenticated, user, customerDetails, loading } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
    } catch (error) {
      console.error("❌ Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={[styles.row, { flexDirection: rtl ? "row-reverse" : "row" }]}
      >
        <Image
          source={require("@/assets/images/home/profile.png")}
          style={styles.image}
          contentFit="cover"
        />
        <View
          style={[
            styles.textContainer,
            {
              marginLeft: rtl ? 0 : SIZES.base,
              marginRight: rtl ? SIZES.base : 0,
            },
          ]}
        >
          {isAuthenticated && customerDetails ? (
            <>
              <Typography
                title={`${customerDetails.firstName} ${customerDetails.lastName}`}
                fontSize={SIZES.padding}
                style={{
                  fontWeight: "bold",
                  alignSelf: rtl ? "flex-end" : "flex-start",
                }}
              />
              <Typography
                title={customerDetails.email}
                fontSize={SIZES.caption}
                color={COLORS.grey6}
                style={{
                  fontWeight: "400",
                }}
              />
            </>
          ) : isAuthenticated && user ? (
            <>
              <Typography
                title={
                  user.email.split("@")[0].charAt(0).toUpperCase() +
                  user.email.split("@")[0].slice(1)
                }
                fontSize={SIZES.padding}
                style={{
                  fontWeight: "bold",
                  alignSelf: rtl ? "flex-end" : "flex-start",
                }}
              />
              <Typography
                title={user.email}
                fontSize={SIZES.caption}
                color={COLORS.grey6}
                style={{
                  fontWeight: "400",
                }}
              />
            </>
          ) : (
            <>
              <Typography
                title={t("common.hello")}
                fontSize={SIZES.padding}
                style={{
                  fontWeight: "bold",
                  alignSelf: rtl ? "flex-end" : "flex-start",
                }}
              />
              <Typography
                title={t("common.loginPrompt")}
                fontSize={SIZES.caption}
                color={COLORS.grey6}
                style={{
                  fontWeight: "400",
                }}
              />
            </>
          )}
        </View>
      </View>
      <View style={styles.divider} />
      <View
        style={[
          styles.buttonContainer,
          { flexDirection: rtl ? "row-reverse" : "row" },
        ]}
      >
        {isAuthenticated ? (
          <Button
            color="primary"
            style={[styles.button]}
            onPress={handleLogout}
            disabled={isLoggingOut || loading}
          >
            <Typography
              title={isLoggingOut ? "Logging out..." : "Logout"}
              fontSize={SIZES.desc}
              color={COLORS.white}
              style={{
                fontWeight: rtl ? "500" : "700",
              }}
            />
          </Button>
        ) : (
          <Button
            color="primary"
            style={[styles.button]}
            onPress={() => {
              router.push("/(auth)/sign-up");
            }}
          >
            <Typography
              title={t("common.loginOrSignup")}
              fontSize={SIZES.desc}
              color={COLORS.white}
              style={{
                fontWeight: rtl ? "500" : "700",
              }}
            />
          </Button>
        )}
        <Button
          bordered
          style={styles.button}
          onPress={() => {
            router.push("/track-order");
          }}
        >
          <Typography
            title={t("common.trackOrder")}
            fontSize={SIZES.desc}
            color={COLORS.black}
            style={{
              fontWeight: "700",
            }}
          />
        </Button>
      </View>
    </View>
  );
};

export default ProfileCard;

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.3,
    borderColor: COLORS.gray,
    marginHorizontal: SIZES.caption,
    borderRadius: SIZES.padding,
    padding: 15,
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  row: {
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  textContainer: {
    width: "80%",
  },
  button: {
    width: "45%",
    height: 45,
    borderRadius: 10,
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 10,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.gray1,
    marginVertical: 15,
  },
});
