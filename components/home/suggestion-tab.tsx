import { COLORS } from "@/constants/colors";
import React, { ReactNode } from "react";
import { StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

interface SuggestionTabProps {
  onPress?: () => void;
  lefticon?: ReactNode;
  righticon?: ReactNode;
  title: string;
  containerStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  isSelected?: boolean;
}

const SuggestionTab = (props: SuggestionTabProps) => {
  const {
    onPress,
    lefticon,
    righticon,
    title,
    containerStyle,
    iconStyle,
    titleStyle,
    isSelected,
    ...rest
  } = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={[
        styles.container,
        isSelected ? styles.selectedBackground : styles.unselectedBackground,
        containerStyle,
      ]}
      {...rest}
    >
      <View style={styles.contentRow}>
        {lefticon ? (
          <View style={[styles.iconContainer, iconStyle]}>{lefticon}</View>
        ) : null}
        {title ? (
          <Text
            style={[
              styles.title,
              isSelected ? styles.selectedText : styles.unselectedText,
              titleStyle,
            ]}
          >
            {title}
          </Text>
        ) : null}
        {righticon ? (
          <View style={[styles.iconContainer, iconStyle]}>{righticon}</View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: scale(20),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.grey4,
  },
  selectedBackground: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  unselectedBackground: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.grey4,
  },
  contentRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: scale(6),
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: scale(11),
    fontWeight: "500",
    fontFamily: "Roboto-Regular",
  },
  selectedText: {
    color: COLORS.white,
  },
  unselectedText: {
    color: COLORS.secondary,
  },
});

export default SuggestionTab;
