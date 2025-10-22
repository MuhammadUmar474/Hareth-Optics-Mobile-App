// screens/ShippingPolicy.tsx
import CustomAccordion from '@/components/home/policies/customAccordion';
import { BulletPoint, ContentText } from '@/components/home/policies/policyContent';
import PolicyLayout from '@/components/home/policies/policyLayout';
import { COLORS } from '@/constants/colors';
import { Feather, FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet } from 'react-native';
import { verticalScale } from 'react-native-size-matters';

const ShippingPolicy = () => {
  const sections = [
    {
      key: 'freeShipping',
      title: 'Free Standard Shipping',
      icon: <MaterialCommunityIcons name="truck-delivery" size={20} color={COLORS.primary} />,
      content: (
        <>
          <BulletPoint>
            We offer free standard shipping on all orders within Kuwait.
          </BulletPoint>
          <BulletPoint>
            Shipping charges may apply for express delivery or special services — see Exceptions section below.
          </BulletPoint>
        </>
      ),
    },
    {
      key: 'shippingTimes',
      title: 'Shipping Times',
      icon: <Feather name="clock" size={20} color={COLORS.primary} />,
      content: (
        <>
          <BulletPoint>
            Standard deliveries will typically arrive within 2-5 business days after the order is dispatched.
          </BulletPoint>
          <BulletPoint>
            Some products (e.g., custom-made items, complex prescription lenses) may take longer — this will be clearly indicated on the product page.
          </BulletPoint>
        </>
      ),
    },
    {
      key: 'exceptions',
      title: 'Exceptions & Additional Charges',
      icon: <MaterialIcons name="add-circle-outline" size={20} color={COLORS.primary} />,
      content: (
        <>
          <BulletPoint>
            Free standard shipping applies only to deliveries to addresses within Kuwait.
          </BulletPoint>
          <BulletPoint>
            For remote locations, islands, or international shipments, additional shipping charges may apply — you will be informed at checkout.
          </BulletPoint>
          <BulletPoint>
            Express/priority shipping upgrades (if available) will incur additional fees.
          </BulletPoint>
        </>
      ),
    },
    {
      key: 'tracking',
      title: 'Order Dispatch & Tracking',
      icon: <MaterialCommunityIcons name="package-variant-closed" size={20} color={COLORS.primary} />,
      content: (
        <>
          <BulletPoint>
            Once your order is placed and payment is confirmed, we will dispatch your package. A tracking number will be provided via email or SMS.
          </BulletPoint>
          <BulletPoint>
            If you receive a tracking notification indicating dispatch, the shipping time mentioned above begins from the dispatch date.
          </BulletPoint>
        </>
      ),
    },
    {
      key: 'damage',
      title: 'Shipping Damage & Missing Items',
      icon: <MaterialCommunityIcons name="package-variant" size={20} color={COLORS.primary} />,
      content: (
        <>
          <BulletPoint>
            All shipments are insured against damage during transit. If you receive a package that is visibly damaged or tampered with, please do not accept it and contact our customer support immediately.
          </BulletPoint>
          <BulletPoint>
            For missing items, contact us within 48 hours of delivery.
          </BulletPoint>
        </>
      ),
    },
    {
      key: 'policyChanges',
      title: 'Policy Changes',
      icon: <MaterialIcons name="update" size={20} color={COLORS.primary} />,
      content: (
        <ContentText>
          We reserve the right to modify this shipping policy at any time. Any changes will apply only to orders placed after the policy update.
        </ContentText>
      ),
    },
    {
      key: 'contact',
      title: 'Contact Us',
      icon: <Feather name="headphones" size={20} color={COLORS.primary} />,
      content: (
        <ContentText>
          For shipping-related queries, contact our customer support team via email, phone, or live chat available on our website.
        </ContentText>
      ),
    },
  ];

  return (
    <PolicyLayout
      title="Shipping Policy"
      heroTitle="Free Shipping"
      heroSubtitle="Enjoy free standard shipping on all orders. Fast, reliable, and hassle-free delivery to your doorstep."
      heroIcon={<FontAwesome5 name="shipping-fastt" size={32} color={COLORS.primary} />}
    >
      <CustomAccordion sections={sections} defaultExpanded="freeShipping" />

      {/* <Button
        style={styles.trackOrderButton}
        onPress={() => {
          // Navigate to order tracking
        }}
      >
        <Typography title="Track Your Order" style={styles.buttonText} />
      </Button> */}
    </PolicyLayout>
  );
};

export default ShippingPolicy;

const styles = StyleSheet.create({
  trackOrderButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: verticalScale(12),
    borderRadius: 28,
    alignItems: 'center',
    marginTop: verticalScale(20),
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});