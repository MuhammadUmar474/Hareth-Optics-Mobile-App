import Button from "@/components/ui/custom-button";
import Typography from "@/components/ui/custom-typography";
import { Header } from "@/components/ui/header";
import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import { useLocal } from "@/hooks/use-lang";
import { styles } from "@/styles/order/order-detail";
import { orderDetails, OrderStatus } from "@/utils/data";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { ScrollView, View } from "react-native";

interface OrderStatus {
  title: string;
  date: string;
  completed: boolean;
}

const OrderDetails = () => {
 const{t}=useLocal()
  const orderStatuses: OrderStatus[] = OrderStatus;

  const renderOrderStatus = (status: OrderStatus, index: number) => {
    const isLast = index === orderStatuses.length - 1;

    return (
      <View key={index} style={styles.statusItem}>
        <View style={styles.statusIndicatorContainer}>
          <View
            style={[
              styles.statusCircle,
              status.completed && styles.statusCircleCompleted,
            ]}
          >
            {status.completed && (
              <Ionicons name="checkmark" size={14} color={COLORS.white} />
            )}
          </View>
          {!isLast && (
            <View
              style={[
                styles.statusLine,
                status.completed && styles.statusLineCompleted,
              ]}
            />
          )}
        </View>
        <View style={styles.statusContent}>
          <Typography
            title={status.title}
            fontSize={SIZES.body}
            style={styles.statusTitle}
            color={status.completed ? COLORS.black : COLORS.grey22}
          />
          <Typography title={status.date} fontSize={12} color={COLORS.grey22} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title={t("orderDetail.orderDetails")} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Order Status Timeline */}
        <View style={styles.section}>
          {orderStatuses.map((status, index) =>
            renderOrderStatus(status, index)
          )}
        </View>

        {/* Order ID */}
        <Typography
          title={`Order ${orderDetails.orderId}`}
          fontSize={SIZES.body}
          style={styles.orderId}
        />

        {/* Product Card */}
        <View style={styles.productCard}>
          <Image
            source={{ uri: orderDetails.product.image }}
            style={styles.productImage}
            contentFit="cover"
          />
          <View style={styles.productInfo}>
            <Typography
              title={orderDetails.product.name}
              fontSize={SIZES.body}
              style={styles.productName}
            />
            <Typography
              title={orderDetails.product.size}
              fontSize={12}
              color={COLORS.grey22}
            />
          </View>
        </View>

        {/* Pricing Details */}
        <View style={styles.section}>
          <View style={styles.priceRow}>
            <Typography
              title="Subtotal"
              fontSize={SIZES.body}
              color={COLORS.grey22}
            />
            <Typography
              title={`$${orderDetails.pricing.subtotal.toFixed(2)}`}
              fontSize={SIZES.body}
            />
          </View>
          <View style={styles.priceRow}>
            <Typography
              title="Shipping"
              fontSize={SIZES.body}
              color={COLORS.grey22}
            />
            <Typography
              title={`$${orderDetails.pricing.shipping.toFixed(2)}`}
              fontSize={SIZES.body}
            />
          </View>
          <View style={styles.priceRow}>
            <Typography
              title="Taxes"
              fontSize={SIZES.body}
              color={COLORS.grey22}
            />
            <Typography
              title={`$${orderDetails.pricing.taxes.toFixed(2)}`}
              fontSize={SIZES.body}
            />
          </View>
          <View style={[styles.priceRow, styles.totalRow]}>
            <Typography
              title="Total"
              fontSize={SIZES.body}
              style={styles.totalText}
            />
            <Typography
              title={`$${orderDetails.pricing.total.toFixed(2)}`}
              fontSize={SIZES.body}
              style={styles.totalText}
            />
          </View>
        </View>

        {/* Shipping Address */}
        <View style={styles.section}>
          <Typography
            title="Shipping Address"
            fontSize={SIZES.body}
            style={styles.sectionTitle}
          />
          <Typography
            title={orderDetails.shippingAddress.name}
            fontSize={SIZES.body}
            color={COLORS.grey22}
          />
          <Typography
            title={orderDetails.shippingAddress.address}
            fontSize={SIZES.body}
            color={COLORS.grey22}
          />
          <Typography
            title={orderDetails.shippingAddress.city}
            fontSize={SIZES.body}
            color={COLORS.grey22}
          />
        </View>

        {/* Billing Address */}
        <View style={styles.section}>
          <Typography
            title="Billing Address"
            fontSize={SIZES.body}
            style={styles.sectionTitle}
          />
          <Typography
            title={orderDetails.billingAddress.name}
            fontSize={SIZES.body}
            color={COLORS.grey22}
          />
          <Typography
            title={orderDetails.billingAddress.address}
            fontSize={SIZES.body}
            color={COLORS.grey22}
          />
          <Typography
            title={orderDetails.billingAddress.city}
            fontSize={SIZES.body}
            color={COLORS.grey22}
          />
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Typography
            title="Payment Method"
            fontSize={SIZES.body}
            style={styles.sectionTitle}
          />
          <View style={styles.paymentMethod}>
            <Ionicons name="card" size={18} color={COLORS.grey22} />
            <Typography
              title={orderDetails.paymentMethod}
              fontSize={SIZES.body}
              color={COLORS.grey22}
              style={{ marginLeft: 8 }}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {/* <Button
            color="primary"
            style={styles.button}
            onPress={() => {
              // Track shipment logic
            }}
          >
            <Typography
              title="Track Shipment"
              fontSize={SIZES.body}
              style={{ fontWeight: "700" }}
              color={COLORS.white}
            />
          </Button> */}

          <Button
            color="secondary"
            style={styles.buttonSecondary}
            onPress={() => {
              // Download invoice logic
            }}
          >
            <Typography
              title="Download Invoice"
              fontSize={SIZES.body}
              style={{ fontWeight: "700" }}
              color={COLORS.primary}
            />
          </Button>

          <Button
            color="secondary"
            style={styles.buttonSecondary}
            onPress={() => {
              // Reorder items logic
            }}
          >
            <Typography
              title="Reorder Items"
              fontSize={SIZES.body}
              style={{ fontWeight: "700" }}
              color={COLORS.primary}
            />
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default OrderDetails;
