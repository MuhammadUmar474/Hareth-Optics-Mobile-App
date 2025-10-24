import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import { useLangStore } from "@/store/langStore";
import { Ionicons } from "@expo/vector-icons";
import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Linking, StyleSheet, TouchableOpacity, View } from "react-native";
import Typography from "../ui/custom-typography";

export interface StoreItem {
  id: string;
  name: string;
  address: string;
  phone: string;
  distanceKm?: string;
}

interface StoreCardProps {
  store: StoreItem;
 
}

const StoreCard: React.FC<StoreCardProps> = ({ store }) => {
  const lang = useLangStore((state) => state.language);
  const rtl = lang === "ar";
  const { t } = useTranslation();
  const handleDirections = () => {
   
      Linking.openURL(store.distanceKm!)
        .catch(() => {
          Alert.alert("Error", "Unable to open map.");
        });
    
  };
  
  const handleCall = () => {
    Linking.openURL(`tel:${store.phone}`)
      .catch(() => {
        Alert.alert("Error", "Unable to open dial pad.");
      });
  };
  


  return (
    <View style={styles.container}>
      <View style={[styles.headerRow, { flexDirection: rtl ? "row-reverse" : "row" }]}>
        <Typography
          title={store.name}
          fontSize={SIZES.title}
          color={COLORS.secondary}
          style={{ fontWeight: "700" }}
        />
        {typeof store.distanceKm === "number" ? (
          <View style={styles.distancePill}>
            <Ionicons name="navigate" size={14} color={COLORS.primary} />
            <Typography
              title={`${store.distanceKm.toFixed(1)} km`}
              fontSize={SIZES.caption}
              color={COLORS.primary}
              style={{ marginLeft: 4, fontWeight: "600" }}
            />
          </View>
        ) : null}
      </View>

      <Typography
        style={{ textAlign: rtl ? "right" : "left" }}
        title={store.address}
        fontSize={SIZES.desc}
        color={COLORS.grayText}
        style={{ marginTop: 4, textAlign: rtl ? "right" : "left" }}
      />

      <View style={[styles.actionsRow, { flexDirection: rtl ? "row-reverse" : "row" }]}>
        <TouchableOpacity style={[styles.actionBtn, { flexDirection: rtl ? "row-reverse" : "row" }]} onPress={handleCall} activeOpacity={0.8}>
          <Ionicons name="call" size={16} color={COLORS.white} />
          <Typography
            title={t("storeLocator.Call")}
            fontSize={SIZES.caption}
            color={COLORS.white}
            style={{ marginLeft: 6, fontWeight: "700", textAlign: rtl ? "right" : "left" }}
          />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn, { flexDirection: rtl ? "row-reverse" : "row" }]} onPress={handleDirections} activeOpacity={0.8}>
          <Ionicons name="navigate" size={16} color={COLORS.primary} />
          <Typography
            title={t("storeLocator.Directions")}
            fontSize={SIZES.caption}
            color={COLORS.primary}
            style={{ marginLeft: 6, fontWeight: "700", textAlign: rtl ? "right" : "left" }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(StoreCard);

const styles = StyleSheet.create({
  container: {
    borderRadius: SIZES.padding,
    padding: 12,
    marginTop: 12,
    backgroundColor: COLORS.white6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  distancePill: {
    backgroundColor: COLORS.primary20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 12,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  secondaryBtn: {
    backgroundColor: COLORS.primary10,
  },
});


