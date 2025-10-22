// screens/ReturnPolicy.tsx (Complete Version)
import CustomAccordion from '@/components/home/policies/customAccordion';
import { BulletPoint, ContentText } from '@/components/home/policies/policyContent';
import PolicyLayout from '@/components/home/policies/policyLayout';
import { COLORS } from '@/constants/colors';
import { Feather, FontAwesome, Fontisto, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet } from 'react-native';
import { verticalScale } from 'react-native-size-matters';

const ReturnPolicy = () => {
  const sections = [
    {
      key: 'returnWindow',
      title: 'Return Window',
      icon: <Feather name="clock" size={20} color={COLORS.primary} />,
      content: (
        <ContentText>
          You may return products up to 14 days after receipt for any reason — no questions asked.
        </ContentText>
      ),
    },
    {
      key: 'eligibility',
      title: 'Eligibility Conditions',
      icon: <Feather name="check-circle" size={20} color={COLORS.primary} />,
      content: (
        <>
          <BulletPoint>
            The product must be in its original condition: unused, with tags, invoice, original packaging intact.
          </BulletPoint>
          <BulletPoint>
            You must notify us of your return/exchange request within the 14-day period, stating your order number, purchase date, and reason for return.
          </BulletPoint>
          <BulletPoint>
            We will arrange a free pick-up of the item from your address (if applicable), once the return request is approved.
          </BulletPoint>
        </>
      ),
    },
    {
      key: 'exchanges',
      title: 'Exchanges',
      icon: <MaterialIcons name="swap-horiz" size={20} color={COLORS.primary} />,
      content: (
        <>
          <BulletPoint>
            You can request an exchange for a different product of equal or higher value. If higher value, you'll pay the difference.
          </BulletPoint>
          <BulletPoint>
            If you choose a lower-value product, no refund of the difference will be made.
          </BulletPoint>
        </>
      ),
    },
    {
      key: 'refunds',
      title: 'Refunds',
      icon: <FontAwesome name="money" size={20} color={COLORS.primary} />,
      content: (
        <>
          <BulletPoint>
            Once we receive and inspect the returned item, we will process the refund.
          </BulletPoint>
          <BulletPoint>
            The maximum refund amount is the total amount you paid (no extra or unforeseen reimbursements).
          </BulletPoint>
          <BulletPoint>
            Refunds will be credited to your original payment method within 5-7 business days.
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
            Separately, products are covered by a 1-year manufacturing defects warranty.
          </BulletPoint>
          <BulletPoint>
            Warranty claims are handled separately and outside the "no-questions-asked" return window.
          </BulletPoint>
        </>
      ),
    },
    {
      key: 'exceptions',
      title: 'Exceptions / Non-Eligibility',
      icon: <Feather name="x-circle" size={20} color={COLORS.primary} />,
      content: (
        <>
          <BulletPoint>
            Items that show signs of use, damage, missing tags, or have been returned after 14 days may not qualify under this policy.
          </BulletPoint>
          <BulletPoint>
            Clearance items and/or certain specified products may be excluded or have a different return policy.
          </BulletPoint>
        </>
      ),
    },
    {
      key: 'howToInitiate',
      title: 'How to Initiate a Return',
      icon: <MaterialCommunityIcons name="clipboard-text-outline" size={20} color={COLORS.primary} />,
      content: (
        <>
          <BulletPoint>
            Contact our customer support with your order number and reason. We will arrange pick-up and follow the process.
          </BulletPoint>
          <BulletPoint>
            The item must be packaged securely for transit; any damage in transit due to improper packaging may disqualify the return.
          </BulletPoint>
        </>
      ),
    },
    {
      key: 'whenNotApply',
      title: 'When the Policy Doesn\'t Apply',
      icon: <MaterialCommunityIcons name="alert-circle-outline" size={20} color={COLORS.primary} />,
      content: (
        <BulletPoint>
          If you miss the 14-day window, then standard warranty or other after-sales policies apply — but the "no questions asked" return option ends.
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
            This policy is subject to change; we will notify customers of any material changes.
          </BulletPoint>
          <BulletPoint>
            For any questions, please contact our support team via email or phone.
          </BulletPoint>
        </>
      ),
    },
  ];

  return (
    <PolicyLayout
      title="Returns Policy"
      heroTitle="No Questions Asked Returns"
      heroSubtitle="Not happy? We'll take it back. It's that simple."
      heroIcon={<Fontisto name="arrow-return-left" size={32} color={COLORS.primary} />}
    >
      <CustomAccordion sections={sections} defaultExpanded="returnWindow" />
     {/* 
      <Button
        style={styles.initiateButton}
        onPress={() => {
          // Navigate to return form
        }}
      >
        <Typography title="Initiate a Return" style={styles.buttonText} />
      </Button> */}
    </PolicyLayout>
  );
};

export default ReturnPolicy;

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