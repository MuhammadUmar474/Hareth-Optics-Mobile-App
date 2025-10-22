import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import { useLocal } from "@/hooks/use-lang";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import React, { useState } from "react";
import {
  NativeSyntheticEvent,
  Platform,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputEndEditingEventData,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Typography from "./custom-typography";

const ICON_SIZE = 16;

interface CustomTextInputProps extends TextInputProps {
  email?: boolean;
  isSecure?: boolean;
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  number?: boolean;
  placeHolder?: string;
  textColor?: string;
  error?: string | undefined;
  date?: boolean;
  uneditable?: boolean;
  iconName?: ComponentProps<typeof Feather>["name"];
  multiline?: boolean;
  title?: boolean;
  labelStyles?:StyleProp<TextStyle>;
  height?: number;
  placeholderTextColor?: string;
  paid?: boolean;
  onEndEditing?: (
    e: NativeSyntheticEvent<TextInputEndEditingEventData>
  ) => void;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  email,
  isSecure,
  label,
  style,
  containerStyle,
  number,
  placeHolder,
  textColor,
  labelStyles,
  error,
  date,
  uneditable,
  iconName,
  multiline,
  title,
  height,
  placeholderTextColor,
  paid,
  onEndEditing,
  ...props
}) => {
  const [isDisplayed, setIsDisplayed] = useState(false);
  const {isRtl}=useLocal();
  const inputType: TextInputProps["keyboardType"] = email
    ? "email-address"
    : number
    ? "numeric"
    : "default";

  const hasIcon = Boolean(email || isSecure || date || iconName);

  const toggleDisplay = () => {
    setIsDisplayed(!isDisplayed);
  };

  return (
    <View style={containerStyle}>
      {label && (
        <Typography
          title={label}
          fontSize={SIZES.body}
          color={COLORS.black2}
          style={[styles.label, labelStyles]}
        />
      )}

      <View
        style={[
         
          styles.inputContainer,
          error && { borderColor: COLORS.danger },
          { height: height , flexDirection: isRtl ?"row-reverse":"row" },
        ]}
        pointerEvents={uneditable ? "none" : "auto"}
      >
        {iconName && (
          <Feather
            name={iconName}
            color={
              iconName === "search"
                ? COLORS.black
                : error
                ? COLORS.danger
                : COLORS.primary
            }
            size={ICON_SIZE}
            style={[styles.icon, iconName === "search" && styles.iconSearch]}
          />
        )}

        {email && (
          <Feather
            name="mail"
            color={error ? COLORS.danger : COLORS.primary}
            size={ICON_SIZE}
            style={styles.icon}
          />
        )}

        {isSecure && (
          <TouchableOpacity onPress={toggleDisplay}>
            <Feather
              name={isDisplayed ? "eye" : "eye-off"}
              color={error ? COLORS.danger : COLORS.primary}
              size={ICON_SIZE}
              style={styles.icon}
            />
          </TouchableOpacity>
        )}

        {date && (
          <Feather
            name="calendar"
            color={error ? COLORS.danger : COLORS.primary}
            size={ICON_SIZE}
            style={styles.icon}
          />
        )}

        {paid && (
          <MaterialIcons
            name="euro"
            color={error ? COLORS.danger : COLORS.primary}
            size={ICON_SIZE}
            style={styles.icon}
          />
        )}

        <TextInput
          style={[
            styles.inputBase,
            title ? styles.inputTitle : styles.inputText,
            hasIcon && styles.inputHasIcon,
            multiline && styles.inputMultiline,
            style,
          ]}
          placeholder={placeHolder}
          placeholderTextColor={placeholderTextColor}
          textAlignVertical={multiline ? "top" : "center"}
          keyboardType={inputType}
          secureTextEntry={isSecure && !isDisplayed}
          multiline={multiline}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect={false}
          onEndEditing={onEndEditing}
          editable={!uneditable}
          {...props}
        />
      </View>

      {error && (
        <Typography
          fontSize={12}
          color={COLORS.danger}
          style={styles.errorMessage}
          textAlign={isRtl ? "right" : "left"}
          title={error}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create<{
  label: TextStyle;
  icon: TextStyle;
  iconSearch: TextStyle;
  inputContainer: ViewStyle;
  inputBase: TextStyle;
  inputTitle: TextStyle;
  inputText: TextStyle;
  inputHasIcon: TextStyle;
  inputMultiline: TextStyle;
  errorMessage: TextStyle;
}>({
  label: {
    marginBottom: SIZES.padding * 0.5,
    fontWeight: "600",
  },
  icon: {
  },
  iconSearch: {
    fontSize: 25,
  },
  inputContainer: {
    alignItems: "center",
    borderRadius: SIZES.padding * 0.5,
    paddingVertical: Platform.select({
      ios: SIZES.padding * 0.6,
      android: 0,
    }),
    gap:SIZES.padding * 0.5,
    paddingHorizontal: SIZES.padding * 0.6,
    backgroundColor: "whitesmoke",
    borderColor: "whitesmoke",
    borderWidth: StyleSheet.hairlineWidth,
    width: "100%",
  },
  inputBase: {
    fontSize: SIZES.header,
    color: COLORS.secondary,
    width: "100%",
  },
  inputTitle: {
    fontFamily: "Poppins-Bold",
  },
  inputText: {
    fontFamily: "Roboto-Regular",
  },
  inputHasIcon: {
    width: "90%",
  },
  inputMultiline: {
    minHeight: 100,
  },
  errorMessage: {
    marginTop: SIZES.padding * 0.5,
  },
});

export default CustomTextInput;
