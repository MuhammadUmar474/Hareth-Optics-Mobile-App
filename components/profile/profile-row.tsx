import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import { useLangStore } from "@/store/langStore";
import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Typography from "../ui/custom-typography";

const ProfileRow: React.FC<{
  Title: string;
  iconName?: string;
  onPress: () => void;
}> = ({ Title, iconName, onPress }) => {
  const lang = useLangStore(state => state.language);
  const rtl = lang === 'ar';

  return (
    <TouchableOpacity
      style={[styles.container,{flexDirection: rtl ? "row-reverse" : "row"}]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.row,{flexDirection: rtl ? "row-reverse" : "row"}]}
      >
        {iconName ? (
          <Feather name={iconName as any} size={20} color="black" />
        ) : null}
        <Typography
          title={Title}
          fontSize={SIZES.body}
          style={{
            marginLeft: rtl ? 0 : SIZES.base,
            marginRight: rtl ? SIZES.base : 0,
            fontWeight: "500",
          }}
        />
      </View>
      <Feather name={rtl ? "chevron-left" : "chevron-right"} size={20} color="black" />
    </TouchableOpacity>
  );
};



export default ProfileRow;

const styles = StyleSheet.create({
  container: {
   
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SIZES.radius,
    paddingVertical: SIZES.caption,
    borderWidth: 0.5,
    borderColor: COLORS.gray,
    borderRadius: SIZES.base,
    marginBottom: SIZES.base,
  },
  row: {
    flexDirection:  "row",
    alignItems: "center",
  },
});
