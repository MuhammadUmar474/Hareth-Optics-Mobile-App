import { COLORS } from "@/constants/colors";
import React, { ReactNode } from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";
type ButtonProps = {
  style?: StyleProp<ViewStyle>;
  opacity?: number;
  color?: string;
  end?: boolean; // Not used currently
  start?: boolean; // Not used currently
  bordered?: boolean;
  disabled?: boolean;
  shadow?: boolean;
  children: ReactNode;
} & TouchableOpacityProps;

const Button: React.FC<ButtonProps> = ({
  style,
  opacity,
  color,
  end,
  start,
  bordered,
  children,
  disabled,
  shadow,
  ...props
}) => {
  const buttonStyles: StyleProp<ViewStyle> = [
    styles.button,
    disabled && styles.disabled,
    color && !disabled && styles[color as keyof typeof styles],
    shadow && styles.shadow,
    bordered && styles.border,
    style,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      activeOpacity={opacity ?? 0.8}
      disabled={disabled ?? false}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 40,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  border: {
    borderColor: COLORS.secondary,
    borderWidth: StyleSheet.hairlineWidth,
  },
  primary: { backgroundColor: COLORS.primary },
  disabled: { backgroundColor: COLORS.gray },
  secondary: { backgroundColor: COLORS.secondary },
  accent: { backgroundColor: COLORS.accent },
  white: { backgroundColor: COLORS.white },
  black: { backgroundColor: COLORS.black },
  gray: { backgroundColor: COLORS.gray },
  gray2: { backgroundColor: COLORS.gray2 },
  danger: { backgroundColor: COLORS.danger },
  success: { backgroundColor: COLORS.success },
  warning: { backgroundColor: COLORS.warning },
});

export default Button;
