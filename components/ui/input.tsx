import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import React, { ReactNode } from "react";
import {
  Platform,
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import Typography from "./custom-typography";

interface InputProps extends TextInputProps {
  label?: string;
  leftAccessory?: ReactNode;
  rightAccessory?: ReactNode;
  containerStyle?: any;
  inputStyle?: any;
  inputContainerStyle?: any;
  placeholderTextColor?: string;
  onLeftAccessoryPress?: () => void;
  onRightAccessoryPress?: () => void;
}

const Input: React.FC<InputProps> = ({
  label,
  leftAccessory,
  rightAccessory,
  containerStyle,
  inputStyle,
  inputContainerStyle,
  placeholderTextColor = COLORS.grey10,
  onLeftAccessoryPress,
  onRightAccessoryPress,
  ...textInputProps
}) => {
  const hasLeftAccessory = !!leftAccessory;
  const hasRightAccessory = !!rightAccessory;

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Typography
          title={label}
          fontSize={SIZES.caption}
          color={COLORS.gray}
          style={styles.label}
        />
      ) : null}

      <View style={[styles.inputContainer, inputContainerStyle]}>
        {hasLeftAccessory ? (
          <TouchableOpacity
            onPress={onLeftAccessoryPress}
            disabled={!onLeftAccessoryPress}
            style={styles.leftAccessory}
          >
            {leftAccessory}
          </TouchableOpacity>
        ) : null}

        <TextInput
          style={[
            styles.input,
            hasLeftAccessory && styles.inputWithLeftAccessory,
            hasRightAccessory && styles.inputWithRightAccessory,
            inputStyle,
          ]}
          placeholderTextColor={placeholderTextColor}
          {...textInputProps}
        />

        {hasRightAccessory ? (
          <TouchableOpacity
            onPress={onRightAccessoryPress}
            disabled={!onRightAccessoryPress}
            style={styles.rightAccessory}
          >
            {rightAccessory}
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    marginBottom: SIZES.padding * 0.5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: SIZES.radius,
    paddingVertical: Platform.select({
      ios: SIZES.padding * 0.6,
      android: SIZES.padding * 0.4,
    }),
    paddingHorizontal: SIZES.padding * 0.6,
    backgroundColor: COLORS.white3,
    borderColor: COLORS.grey4,
    borderWidth: 1,
    minHeight: 48,
  },
  errorContainer: {
    borderColor: COLORS.danger,
  },
  input: {
    flex: 1,
    fontSize: SIZES.header,
    fontFamily: "Roboto-Regular",
    color: COLORS.secondary,
    paddingVertical: 0,
  },
  inputWithLeftAccessory: {
    marginLeft: SIZES.padding * 0.5,
  },
  inputWithRightAccessory: {
    marginRight: SIZES.padding * 0.5,
  },
  leftAccessory: {
    justifyContent: "center",
    alignItems: "center",
    paddingRight: SIZES.padding * 0.25,
  },
  rightAccessory: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: SIZES.padding * 0.25,
  },
});

export default Input;
