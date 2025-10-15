import { COLORS } from "@/constants/colors";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
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
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

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
  }, []);

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
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>Order #{order.id}</Text>
          <Text style={styles.orderStatus}>{order.status}</Text>
        </View>

        <Text style={styles.orderDetails}>
          Placed on {order.date} • {order.items} items • KD {order.total}
        </Text>

        <View style={styles.productImagesContainer}>
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
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateScale(8),
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
  productImagesContainer: {
    flexDirection: "row",
    gap: moderateScale(12),
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
