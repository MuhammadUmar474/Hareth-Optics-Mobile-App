import { COLORS } from "@/constants/colors";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { useCallback, useEffect, useState } from "react";
import { LayoutChangeEvent, Platform, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import TabBarButton from "./tab-bar-button";

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const [dimenstion, setDimentions] = useState({ width: 20, height: 100 });
  const horizPadding = 10;
  const availableWidth = Math.max(0, dimenstion.width - horizPadding * 2);
  const buttonWidth = availableWidth / state.routes.length;
  const INDICATOR_SHRINK = 16; // total pixels less than button width
  const indicatorWidth = Math.max(0, buttonWidth - INDICATOR_SHRINK);
  const tabPostionX = useSharedValue(0);

  const getTabOffset = useCallback(
    (i: number) =>
      horizPadding + i * buttonWidth + (buttonWidth - indicatorWidth) / 2,
    [horizPadding, buttonWidth, indicatorWidth]
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      left: tabPostionX.value,
    };
  });

  const onTabBarLayout = (event: LayoutChangeEvent) => {
    setDimentions({
      width: event.nativeEvent.layout.width,
      height: event.nativeEvent.layout.height,
    });
  };

  useEffect(() => {
    tabPostionX.value = withSpring(getTabOffset(state.index), {
      damping: 32,
      stiffness: 200,
    });
  }, [buttonWidth, state.index, tabPostionX, getTabOffset]);

  type IconProps = { color: string };
  type IconRenderer = (props: IconProps) => React.ReactElement;
  type RouteKey =
    | "(a-home)"
    | "(explore)"
    | "(3d-try-on)"
    | "(orders)"
    | "(profile)"
    | "index"
    | "explore";

  const icon: Record<RouteKey, IconRenderer> = {
    "(a-home)": ({ color }) => <Feather name="home" size={24} color={color} />,
    "(explore)": ({ color }) => (
      <MaterialCommunityIcons
        name="star-four-points-outline"
        size={24}
        color={color}
      />
    ),
    "(3d-try-on)": ({ color }) => (
      <Ionicons name="glasses" size={24} color={color} />
    ),
    "(orders)": ({ color }) => (
      <MaterialCommunityIcons name="email-variant" size={24} color={color} />
    ),
    "(profile)": ({ color }) => <Feather name="user" size={24} color={color} />,
    index: ({ color }) => <Feather name="home" size={24} color={color} />,
    explore: ({ color }) => (
      <MaterialCommunityIcons
        name="star-four-points-outline"
        size={24}
        color={color}
      />
    ),
  };

  const iconMap = icon as Record<string, IconRenderer>;
  const { checkAuthAndNavigate } = useAuthGuard();
  return (
    <View onLayout={onTabBarLayout} style={styles.tabbar}>
      <Animated.View
        style={[
          animatedStyle,
          {
            position: "absolute",
            backgroundColor: COLORS.primary,
            borderRadius: 30,
            width: indicatorWidth,
            height: dimenstion.height - 25,
          },
        ]}
      />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const rawLabel =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;
        const label = typeof rawLabel === "string" ? rawLabel : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          if (route.name === "(a-home)") {
            navigation.navigate(route.name);
            return;
          }
          checkAuthAndNavigate("/(auth)/login","Please login to access this feature")
          tabPostionX.value = withSpring(getTabOffset(index), {
            duration: 350,
          });
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.key}
            onPress={onPress}
            onLongPress={onLongPress}
            routeName={route.name}
            isFocused={isFocused}
            colors={COLORS}
            iconMap={iconMap}
            label={label}
          />
        );
      })}
    </View>
  );
};

export default TabBar;

const styles = StyleSheet.create({
  tabbar: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 30 : 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 35,
    paddingHorizontal: 10,
    paddingVertical: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowRadius: 10,
    shadowOpacity: 0.1,
    borderWidth: 1,
    borderColor: COLORS.grey4,
  },
});
