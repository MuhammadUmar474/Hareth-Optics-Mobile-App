import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import { Ionicons } from "@expo/vector-icons";
import React, { memo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Typography from "../ui/custom-typography";

export interface PrescriptionItem {
  id: string;
  name: string; // e.g., "Distance", "Reading"
  date: string; // ISO date string
  rightSphere: string;
  rightCylinder?: string;
  rightAxis?: string;
  leftSphere: string;
  leftCylinder?: string;
  leftAxis?: string;
  pd?: string; // Pupillary distance
  notes?: string;
}

interface PrescriptionCardProps {
  item: PrescriptionItem;
  onView?: (item: PrescriptionItem) => void;
  onShare?: (item: PrescriptionItem) => void;
  onDelete?: (item: PrescriptionItem) => void;
}

const Row: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
  <View style={styles.row}>
    <Typography title={label} fontSize={SIZES.caption} color={COLORS.grey22} />
    <Typography
      title={value ?? "-"}
      fontSize={SIZES.caption}
      color={COLORS.secondary}
      style={{ fontWeight: "600" }}
    />
  </View>
);

const EyeBlock: React.FC<{ title: string; s?: string }> = ({ title, s }) => (
  <View style={styles.eyeBlock}>
    <Typography
      title={title}
      fontSize={SIZES.body}
      color={COLORS.secondary}
      style={{ fontWeight: "700" }}
    />
    <Row label="SPH" value={s} />
  </View>
);

const PrescriptionCard: React.FC<PrescriptionCardProps> = ({
  item,
  onView,
  onShare,
  onDelete,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Typography
          title={item.name}
          fontSize={SIZES.title}
          color={COLORS.secondary}
          style={{ fontWeight: "700" }}
        />
        <Typography
          title={new Date(item.date).toDateString()}
          fontSize={SIZES.caption}
          color={COLORS.grayText}
        />
      </View>

      <View style={styles.grid}>
        <EyeBlock title="SPH Right" s={item.rightSphere} />
        <EyeBlock title="SPH Left" s={item.leftSphere} />
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.dangerBtn]}
          onPress={() => onDelete?.(item)}
          activeOpacity={0.8}
        >
          <Ionicons name="trash" size={16} color={COLORS.white} />
          <Typography
            title="Delete"
            fontSize={SIZES.caption}
            color={COLORS.white}
            style={{ marginLeft: 6, fontWeight: "700" }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(PrescriptionCard);

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
    marginBottom: 8,
  },
  grid: {
    flexDirection: "row",
    gap: 12,
  },
  eyeBlock: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  pill: {
    backgroundColor: COLORS.primary10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
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
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  primaryBtn: { backgroundColor: COLORS.primary },
  secondaryBtn: { backgroundColor: COLORS.primary10 },
  dangerBtn: { backgroundColor: COLORS.danger },
});
