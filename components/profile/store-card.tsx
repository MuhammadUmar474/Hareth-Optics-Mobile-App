import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import { Ionicons } from "@expo/vector-icons";
import React, { memo } from "react";
import { Linking, Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import Typography from "../ui/custom-typography";

export interface StoreItem {
  id: string;
  name: string;
  address: string;
  phone: string;
  distanceKm?: number;
  lat?: number;
  lng?: number;
}

interface StoreCardProps {
  store: StoreItem;
  onPressDirections?: (store: StoreItem) => void;
  onPressCall?: (store: StoreItem) => void;
}

const StoreCard: React.FC<StoreCardProps> = ({ store, onPressDirections, onPressCall }) => {
  const handleCall = () => {
    if (onPressCall) return onPressCall(store);
    if (store.phone) {
      Linking.openURL(`tel:${store.phone}`);
    }
  };

  const handleDirections = () => {
    if (onPressDirections) return onPressDirections(store);
    const { lat, lng, address } = store;
    const query = lat && lng ? `${lat},${lng}` : encodeURIComponent(address);
    const url = Platform.select({
      ios: `maps://?q=${query}`,
      android: `geo:0,0?q=${query}`,
      default: `https://www.google.com/maps/search/?api=1&query=${query}`,
    });
    if (url) Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
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
        title={store.address}
        fontSize={SIZES.desc}
        color={COLORS.grayText}
        style={{ marginTop: 4 }}
      />

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleCall} activeOpacity={0.8}>
          <Ionicons name="call" size={16} color={COLORS.white} />
          <Typography
            title="Call"
            fontSize={SIZES.caption}
            color={COLORS.white}
            style={{ marginLeft: 6, fontWeight: "700" }}
          />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]} onPress={handleDirections} activeOpacity={0.8}>
          <Ionicons name="navigate" size={16} color={COLORS.primary} />
          <Typography
            title="Directions"
            fontSize={SIZES.caption}
            color={COLORS.primary}
            style={{ marginLeft: 6, fontWeight: "700" }}
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


