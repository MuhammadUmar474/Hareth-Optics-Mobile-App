import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Typography from "../ui/custom-typography";

interface AddressCardProps {
  label: string;
  address: string;
  isDefault: boolean;
  iconName: keyof typeof Ionicons.glyphMap;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}
const AddressCard = ({
  label,
  address,
  isDefault,
  iconName,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressCardProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name={iconName as any} size={20} color={COLORS.primary} />
      </View>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Typography
            title={label}
            fontSize={SIZES.title}
            color={COLORS.secondary}
            style={{ fontWeight: "700" }}
          />
          {isDefault ? (
            <View style={styles.defaultPill}>
              <Typography
                title="Default"
                fontSize={SIZES.caption}
                color={COLORS.primary}
                style={{ fontWeight: "600" }}
              />
            </View>
          ) : null}
        </View>
        <Typography
          title={address}
          fontSize={SIZES.desc}
          color={COLORS.grayText}
          style={{ marginTop: 4 }}
        />
        <View style={styles.actionsRow}>
          <TouchableOpacity onPress={onEdit}>
            <Typography
              title="Edit"
              fontSize={SIZES.desc}
              color={COLORS.primary}
              style={{ fontWeight: "700" }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete}>
            <Typography
              title="Delete"
              fontSize={SIZES.desc}
              color={COLORS.danger2}
              style={{ fontWeight: "700" }}
            />
          </TouchableOpacity>
          {!isDefault ? (
            <TouchableOpacity onPress={onSetDefault}>
              <Typography
                title="Set as Default"
                fontSize={SIZES.desc}
                color={COLORS.grey6}
                style={{ fontWeight: "700" }}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
};

export default AddressCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    borderRadius: SIZES.padding,
    padding: 12,
    marginTop: 12,
    backgroundColor: COLORS.white6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    backgroundColor: COLORS.primary20,
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  defaultPill: {
    backgroundColor: COLORS.primary20,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 10,
  },
});
