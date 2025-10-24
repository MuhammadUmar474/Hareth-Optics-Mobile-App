import { COLORS } from "@/constants/colors";
import { OurPromise } from "@/constants/data";
import { useLocal } from "@/hooks/use-lang";
import { FontAwesome, FontAwesome5, Fontisto, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import Typography from "../ui/custom-typography";

interface OurPromiseProps {
  promises: OurPromise[];
  title?: string;
}

const OurPromiseComponent: React.FC<OurPromiseProps> = ({
  promises,
  title,
}) => {
  const {t,isRtl}=useLocal()
  const renderIcon = (promise: OurPromise) => {
    const iconSize = scale(24);
    const iconColor = COLORS.primary;
    switch (promise.iconLibrary) {
      case "fontisto":
        return (
          <Fontisto
            name={promise.iconName as any}
            size={iconSize}
            color={iconColor}
          />
        );
      case "fontawesome":
        return (
          <FontAwesome
            name={promise.iconName as any}
            size={iconSize}
            color={iconColor}
          />
        );
      case "fontawesome5":
        return (
          <FontAwesome5
            name={promise.iconName as any}
            size={iconSize}
            color={iconColor}
          />
        );
        case "MaterialCommunityIcons":
        return (
          <MaterialCommunityIcons
            name={promise.iconName as any}
            size={iconSize}
            color={iconColor}
          />
        );
      default:
        return null;
    }
  };
  const dynStyles = useMemo(
    () =>
      StyleSheet.create({
        textAlign: { textAlign: isRtl ? "right" : "left" },
        promisBox:{
          flexDirection: isRtl?"row-reverse": "row",
        }
      }),
    [isRtl]
  );
  return (
    <View style={styles.container}>
      <Typography
        title={t(title || "home.harethOptics")}
        fontSize={scale(17)}
        color={COLORS.secondary}
        fontFamily="Roboto-Bold"
        textAlign={dynStyles.textAlign.textAlign}
        style={styles.title}
      />

      <View style={[styles.promiseBox,dynStyles.promisBox]}>
        {promises.map((promise, index) => (
         <TouchableOpacity
         key={promise.id}
         style={styles.promiseItem}
         onPress={promise.onPress ? promise.onPress : undefined}
         activeOpacity={promise.onPress ? 0.7 : 1}
         disabled={!promise.onPress}
       >
       
            <View style={styles.iconContainer}>{renderIcon(promise)}</View>
            {isRtl&& index < promises.length - 1 && <View style={styles.divider} />}

            <Typography
              title={t(promise.name)}
              fontSize={scale(10)}
              color={COLORS.secondary}
              fontFamily="Roboto-Bold"
              style={styles.promiseText}
            />
            {!isRtl && index < promises.length - 1 && <View style={styles.divider} />}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(16),
  },
  promiseBox: {
    backgroundColor: COLORS.white,
    borderRadius: scale(12),
    padding: scale(16),
    gap: scale(10),
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: COLORS.grey29,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.grey4,
  },
  promiseItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  iconContainer: {
    marginBottom: verticalScale(8),
  },
  title: {
    fontWeight: "600",
    marginBottom: verticalScale(12),
    marginTop: verticalScale(-6),
  },
  promiseText: {
    textAlign: "center",
    lineHeight: scale(14),
  },
  divider: {
    position: "absolute",
    right: -10,
    height: "90%",
    width: 1,
    backgroundColor: COLORS.grey4,
  },
});

export default OurPromiseComponent;