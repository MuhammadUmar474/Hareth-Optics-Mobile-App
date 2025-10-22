import { COLORS } from "@/constants/colors";
import { useLocal } from "@/hooks/use-lang";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale } from "react-native-size-matters";

interface Product {
  id: string;
  image: string;
}

export const OrderCard = ({ order, index }: { order: any; index: any }) => {
  const { isRtl} = useLocal();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const dynamicStyles = useMemo(
    () =>
      StyleSheet.create({
        orderHeader: {
          flexDirection: isRtl ? "row-reverse" : "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: moderateScale(8),
        },
        productImagesContainer: {
          flexDirection: isRtl ? "row-reverse" : "row",
          gap: moderateScale(12),
        },
        textAlign: {
          textAlign: isRtl ? "right" : "left",
        },
      }),
    [isRtl]
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        delay: index * 100,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        delay: index * 100,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, index]);

  return (
    <Animated.View
      style={[
        styles.orderCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => {
          router.navigate(`/order-detail`);
        }}
      >
        <View style={dynamicStyles.orderHeader}>
          <Text style={[styles.orderId, dynamicStyles.textAlign]}>
            Order #{order.id}
          </Text>
          <Text style={[styles.orderStatus, dynamicStyles.textAlign]}>
            {order.status}
          </Text>
        </View>

        <Text style={[styles.orderDetails, dynamicStyles.textAlign]}>
          Placed on {order.date} • {order.items} items • KD {order.total}
        </Text>

        <View style={dynamicStyles.productImagesContainer}>
          {order.products.map((product: Product) => (
            <View key={product.id} style={styles.productImageWrapper}>
              <Image
                source={{ uri: product.image }}
                style={styles.productImage}
                contentFit="cover"
                transition={300}
                cachePolicy="memory-disk"
              />
            </View>
          ))}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(20),
    padding: moderateScale(20),
    marginBottom: moderateScale(16),
    ...COLORS.shadow,
  },
  orderId: {
    fontSize: moderateScale(18),
    fontWeight: "600",
    color: COLORS.primary,
  },
  orderStatus: {
    fontSize: moderateScale(14),
    color: COLORS.gray3,
  },
  orderDetails: {
    fontSize: moderateScale(14),
    color: COLORS.grey22,
    marginBottom: moderateScale(16),
  },
  productImageWrapper: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(12),
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
});
