import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";

import React, { useMemo } from "react";
import { DimensionValue, StyleProp, Text, TextProps, TextStyle } from "react-native";

type TypographyProps = TextProps & {
  title: string | number | undefined;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  textMarginTop?: number;
  textAlign?: string;
  width?: DimensionValue;
};

const Typography: React.FC<TypographyProps> = ({
  title,
  fontSize,
  color,
  fontFamily,
  textMarginTop,
  style,
  textAlign,
  width,
  ...rest
}) => {
  const textStyle: StyleProp<TextStyle> = useMemo(
    () => ({
      fontSize: fontSize || SIZES.header,
      color: color || COLORS.black,
      fontFamily: fontFamily,
      marginTop: textMarginTop,
      textAlign: textAlign as TextStyle["textAlign"],
      width: width,
    }),
    [fontSize, color, fontFamily, textMarginTop, textAlign, width]
  );

  return (
    <Text style={[textStyle, style]} {...rest}>
      {title}
    </Text>
  );
};

export default Typography;
