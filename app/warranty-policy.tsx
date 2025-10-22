// screens/WarrantyPolicy.tsx
import CustomAccordion from '@/components/home/policies/customAccordion';
import { BulletPoint, ContentText } from '@/components/home/policies/policyContent';
import PolicyLayout from '@/components/home/policies/policyLayout';
import { COLORS } from '@/constants/colors';
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet } from 'react-native';
import { verticalScale } from 'react-native-size-matters';

const WarrantyPolicy = () => {
  const sections = [
    {
      key: 'warrantyPeriod',
      title: 'Warranty Period',
      icon: <MaterialCommunityIcons name="calendar-clock" size={20} color={COLORS.primary} />,
      content: (
        <ContentText>
          We provide a one-year limited warranty on all eyewear products, starting from the date of delivery/receipt of the product.
        </ContentText>
      ),
    },
    {
      key: 'covered',
      title: "What's Covered",
      icon: <Feather name="check-square" size={20} color={COLORS.primary} />,
      content: (
        <>
          <ContentText>
            This warranty covers manufacturing defects in the product, including but not limited to:
          </ContentText>
          <BulletPoint>
            Lens coating peeling or flaking
          </BulletPoint>
          <BulletPoint>
            Lens spotting/discolouration not caused by user damage
          </BulletPoint>
          <BulletPoint>
            Frame corrosion, rust, colour fading or peeling (if applicable)
          </BulletPoint>
        </>
      ),
    },
    {
      key: 'notCovered',
      title: "What's Not Covered",
      icon: <Feather name="x-square" size={20} color={COLORS.primary} />,
      content: (
        <>
          <ContentText>
            This warranty does not cover:
          </ContentText>
          <BulletPoint>
            Breakage of lenses or frames due to accident, misuse, mishandling, shock or negligence
          </BulletPoint>
          <BulletPoint>
            Scratches, chips or cracks on the lenses or frame due to normal wear and tear
          </BulletPoint>
          <BulletPoint>
            Damage resulting from improper storage or use outside of intended purpose
          </BulletPoint>
          <BulletPoint>
            Unauthorized modifications, repairs or adjustments by third-parties
          </BulletPoint>
          <BulletPoint>
            Loss of parts or accessories (e.g., screws, nose pads)
          </BulletPoint>
        </>
      ),
    },
    {
      key: 'requirements',
      title: 'Warranty Requirements & Conditions',
      icon: <MaterialCommunityIcons name="clipboard-check-outline" size={20} color={COLORS.primary} />,
      content: (
        <>
          <BulletPoint>
            The product must have been purchased through Hareth Optics or an authorized retailer.
          </BulletPoint>
          <BulletPoint>
            The warranty request must be made within the one-year period.
          </BulletPoint>
          <BulletPoint>
            The product must be returned in its original packaging (where applicable) with the invoice/order number and purchase date.
          </BulletPoint>
          <BulletPoint>
            The customer may be required to provide photos of the defect, product serial number and other details as requested.
          </BulletPoint>
          <BulletPoint>
            After inspection and approval of the defect, we will repair or replace the product (at our discretion).
          </BulletPoint>
          <BulletPoint>
            The warranty is limited to repair or replacement of the product; no refunds or compensation for indirect or consequential damage will be provided.
          </BulletPoint>
        </>
      ),
    },
    {
      key: 'howToClaim',
      title: 'How to Claim Warranty',
      icon: <MaterialIcons name="assignment" size={20} color={COLORS.primary} />,
      content: (
        <>
          <BulletPoint>
            Contact our Customer Support with your Order Number, date of purchase, and description of the issue.
          </BulletPoint>
          <BulletPoint>
            We will advise whether the product needs to be mailed back or brought to our store/branch.
          </BulletPoint>
          <BulletPoint>
            Once the product is received, our team will inspect and process the warranty claim. The claim may take 5-10 business days to complete.
          </BulletPoint>
        </>
      ),
    },
    {
      key: 'limitation',
      title: 'Limitation',
      icon: <MaterialCommunityIcons name="alert-circle-outline" size={20} color={COLORS.primary} />,
      content: (
        <>
          <BulletPoint>
            The warranty does not extend the product's original warranty period; i.e., the one-year period is fixed from delivery.
          </BulletPoint>
          <BulletPoint>
            If an exchange or replacement is provided under warranty, the warranty period does not restart — it continues from the original purchase date.
          </BulletPoint>
        </>
      ),
    },
    {
      key: 'miscellaneous',
      title: 'Miscellaneous',
      icon: <MaterialIcons name="info-outline" size={20} color={COLORS.primary} />,
      content: (
        <>
          <BulletPoint>
            This warranty is in addition to your legal rights under Kuwait consumer protection laws.
          </BulletPoint>
          <BulletPoint>
            We reserve the right to revise or modify this warranty policy at any time; changes apply to purchases made after the revision.
          </BulletPoint>
          <BulletPoint>
            Hareth Optics' decision regarding validity of any warranty claim is final.
          </BulletPoint>
        </>
      ),
    },
    {
      key: 'contact',
      title: 'Contact Us',
      icon: <Feather name="phone" size={20} color={COLORS.primary} />,
      content: (
        <ContentText>
          For any questions regarding warranty claims, please contact our customer support team via email, phone, or visit our store. Our team is ready to assist you with your warranty needs.
        </ContentText>
      ),
    },
  ];

  return (
    <PolicyLayout
      title="Warranty Policy"
      heroTitle="1-Year Warranty"
      heroSubtitle="All eyewear products are covered by our comprehensive 1-year warranty against manufacturing defects."
      heroIcon={<MaterialCommunityIcons name="shield-check" size={32} color={COLORS.primary} />}
    >
      <CustomAccordion sections={sections} defaultExpanded="warrantyPeriod" />

      {/* <Button
        style={styles.claimButton}
        onPress={() => {
          // Navigate to warranty claim form or contact support
        }}
      >
        <Typography title="File a Warranty Claim" style={styles.buttonText} />
      </Button> */}
    </PolicyLayout>
  );
};

export default WarrantyPolicy;

const styles = StyleSheet.create({
  claimButton: {
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