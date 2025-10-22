// screens/ExchangePolicy.tsx (Complete Version)
import CustomAccordion from '@/components/home/policies/customAccordion';
import { BulletPoint, ContentText } from '@/components/home/policies/policyContent';
import PolicyLayout from '@/components/home/policies/policyLayout';

import { COLORS } from '@/constants/colors';
import { Feather, FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet } from 'react-native';
import { verticalScale } from 'react-native-size-matters';

const ExchangePolicy = () => {
  const sections = [
    {
      key: 'exchangeWindow',
      title: 'Exchange Window',
      icon: <Feather name="clock" size={20} color={COLORS.primary} />,
      content: (
        <ContentText>
          You may request an exchange of your purchased item within 14 days from the date you received or collected the product.
        </ContentText>
      ),
    },
    {
      key: 'eligibility',
      title: 'Eligibility Conditions for Exchange',
      icon: <Feather name="check-circle" size={20} color={COLORS.primary} />,
      content: (
        <>
          <BulletPoint>
            Product must be returned in its original condition: unused (or only tried), with all tags intact, original packaging, original invoice/receipt present.
          </BulletPoint>
          <BulletPoint>
            You must notify us of your exchange request within the 14-day window, providing your order number, date of receipt, product details, and reason for exchange.
          </BulletPoint>
          <BulletPoint>
            Products returned should not show signs of wear, damage, misuse or missing accessories.
          </BulletPoint>
        </>
      ),
    },
    {
      key: 'exchangeOptions',
      title: 'Exchange Options',
      icon: <MaterialIcons name="swap-horiz" size={20} color={COLORS.primary} />,
      content: (
        <>
          <BulletPoint>
            Same Product Replacement — If you opt for the exact same model/style and lens/package, no extra charge will apply (subject to availability).
          </BulletPoint>
          <BulletPoint>
            Different Product or Upgrade — If you select a different frame, style, or upgrade your package, you must pay the difference in value.
          </BulletPoint>
          <BulletPoint>
            Lower Value Product — If you swap for a product of lower value, you may opt for store-credit for the difference, or we might decline refunding the difference (as per business decision).
          </BulletPoint>
        </>
      ),
    },
    {
      key: 'refundOption',
      title: 'Refund Option (If Exchange Not Desired)',
      icon: <MaterialCommunityIcons name="cash-refund" size={20} color={COLORS.primary} />,
      content: (
        <>
          <BulletPoint>
            If you do not wish to exchange, you may request a refund instead (subject to conditions).
          </BulletPoint>
          <BulletPoint>
            Refunds will be processed once the returned item is received and verified.
          </BulletPoint>
        </>
      ),
    },
    {
      key: 'returnProcess',
      title: 'Return Process & Logistics',
      icon: <MaterialCommunityIcons name="package-variant" size={20} color={COLORS.primary} />,
      content: (
        <>
          <BulletPoint>
            Contact our customer support to initiate the process.
          </BulletPoint>
          <BulletPoint>
            We will arrange for free pick-up of the item from your address (if applicable). Alternatively, you may be instructed to ship the item back at your cost, and we may reimburse a portion (subject to business decision).
          </BulletPoint>
          <BulletPoint>
            The item must be packaged securely. Any damage incurred due to inadequate packaging may make the exchange ineligible.
          </BulletPoint>
        </>
      ),
    },
    {
      key: 'exceptions',
      title: 'Exceptions & Non-Eligibility',
      icon: <Feather name="x-circle" size={20} color={COLORS.primary} />,
      content: (
        <>
          <BulletPoint>
            Items showing signs of use beyond "try-on", missing tags, missing accessories, packaging damage.
          </BulletPoint>
          <BulletPoint>
            Items returned after the 14-day window.
          </BulletPoint>
          <BulletPoint>
            Items explicitly excluded (e.g., clearance items, custom-made / personalized items) — specify as needed.
          </BulletPoint>
        </>
      ),
    },
    {
      key: 'warranty',
      title: 'Warranty',
      icon: <Feather name="shield" size={20} color={COLORS.primary} />,
      content: (
        <>
          <BulletPoint>
            Separately from this "easy exchange" window, items may be covered by a manufacturer or business warranty (for defects, etc.).
          </BulletPoint>
          <BulletPoint>
            Warranty claims are handled separately and are not part of this 14-day exchange policy.
          </BulletPoint>
        </>
      ),
    },
    {
      key: 'policyChanges',
      title: 'Policy Changes',
      icon: <MaterialIcons name="update" size={20} color={COLORS.primary} />,
      content: (
        <BulletPoint>
          We reserve the right to modify this policy at any time. Changes will be communicated on our website.
        </BulletPoint>
      ),
    },
    {
      key: 'miscellaneous',
      title: 'Miscellaneous',
      icon: <MaterialIcons name="info-outline" size={20} color={COLORS.primary} />,
      content: (
        <>
          <BulletPoint>
            This policy applies only to purchases made through Hareth Optics.
          </BulletPoint>
          <BulletPoint>
            In case of any dispute, our decision will be final.
          </BulletPoint>
        </>
      ),
    },
  ];

  return (
    <PolicyLayout
      title="Exchange Policy"
      heroTitle="Easy 14 Days Exchange"
      heroSubtitle="Found a better fit? Exchange it hassle-free within 14 days."
      heroIcon={<FontAwesome name="exchange" size={32} color={COLORS.primary} />}
    >
      <CustomAccordion sections={sections} defaultExpanded="exchangeWindow" />

      {/* <Button
        style={styles.initiateButton}
        onPress={() => {
          // Navigate to exchange form or contact support
        }}
      >
        <Typography title="Request an Exchange" style={styles.buttonText} />
      </Button> */}
    </PolicyLayout>
  );
};

export default ExchangePolicy;

const styles = StyleSheet.create({
  initiateButton: {
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