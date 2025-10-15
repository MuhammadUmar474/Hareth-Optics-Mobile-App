import { COLORS } from "@/constants/colors";
import React, { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type IconProps = { color: string };
type IconRenderer = (props: IconProps) => React.ReactElement;
interface TabBarButtonProps {
  routeName: string;
  isFocused: boolean;
  colors: typeof COLORS;
  onPress: () => void;
  onLongPress: () => void;
  iconMap: Record<string, IconRenderer>;
  label: string;
}
const TabBarButton = ({
  routeName,
  isFocused,
  colors,
  onPress,
  onLongPress,
  iconMap,
  label,
}: TabBarButtonProps) => {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(
      typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused,
      { duration: 350 }
    );
  }, [scale, isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
    const top = interpolate(scale.value, [0, 1], [0, 9]);

    return {
      transform: [
        {
          scale: scaleValue,
        },
      ],
      top,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]);
    return { opacity };
  });

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabBarItem}
    >
      <Animated.View style={animatedIconStyle}>
        {iconMap[routeName]
          ? iconMap[routeName]({
              color: isFocused ? colors.white : colors.black,
            })
          : iconMap["(a-home)"]({
              color: isFocused ? colors.white : colors.black,
            })}
      </Animated.View>
      <Animated.Text
        style={[
          { color: isFocused ? colors.primary : colors.black, fontSize: 13 },
          animatedTextStyle,
        ]}
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
};

export default TabBarButton;

const styles = StyleSheet.create({
  tabBarItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
});
