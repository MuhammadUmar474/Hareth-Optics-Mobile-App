import React, { useEffect, useRef } from "react";
import { Animated, FlatList, StyleSheet, View } from "react-native";
import { moderateScale } from "react-native-size-matters";

import { OrderCard } from "@/components/order/order-card";
import { Header } from "@/components/ui/header";
import { COLORS } from "@/constants/colors";
import { useLocal } from "@/hooks/use-lang";
import { ORDERS } from "@/utils/data";

const MyOrders = () => {
  const{t}=useLocal()
  const headerFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerFadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderOrder = ({ item, index }: { item: any; index: number }) => (
    <OrderCard order={item} index={index} />
  );

  return (
    <View style={styles.container}>
      <Header title={t("orderDetail.myOrder")}/>
      <FlatList
        data={ORDERS}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.ordersContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  ordersContainer: {
    padding: moderateScale(20),
    paddingBottom: moderateScale(100),
  },
});

export default MyOrders;
