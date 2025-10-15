
import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import { Image } from "expo-image";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Button from "../ui/custom-button";
import Typography from "../ui/custom-typography";

interface Tier {
  id: "silver" | "gold" | "platinum";
  title: string;
  description: string;
  image: any;
}

const TIERS: Tier[] = [
  {
    id: "silver",
    title: "Silver",
    description:
      "Enjoy basic benefits like free shipping and standard discounts.",
    image: require("@/assets/images/classic.jpg"),
  },
  {
    id: "gold",
    title: "Gold",
    description:
      "Unlock premium benefits, including exclusive discounts, early access, and personalized offers.",
    image: require("@/assets/images/premium.jpg"),
  },
  {
    id: "platinum",
    title: "Platinum",
    description:
      "Experience the ultimate benefits with priority support, VIP events, and more.",
    image: require("@/assets/images/sale.jpg"),
  },
];

const HarethGoldContent: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<Tier["id"]>("gold");

  const bannerSource = useMemo(
    () => ({
      uri: "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1887&auto=format&fit=crop",
    }),
    []
  );

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.bannerContainer}>
          <Image
            source={bannerSource}
            style={styles.bannerImage}
            contentFit="cover"
          />
        </View>

        <View style={styles.section}>
          <Typography
            title="Unlock Exclusive Benefits"
            fontSize={SIZES.h2}
            style={styles.bold}
          />
          <Typography
            title="Join Hareth Gold and enjoy a range of perks, including free shipping, exclusive discounts, early access to new collections, and personalized offers."
            fontSize={SIZES.body}
            color={COLORS.grey6}
            textMarginTop={8}
          />
        </View>

        <View style={styles.section}>
          <Typography
            title="Membership Tiers"
            fontSize={SIZES.h2}
            style={styles.bold}
          />

          <View style={styles.tiers}>
            {TIERS.map((tier) => {
              const isSelected = tier.id === selectedTier;
              return (
                <View
                  key={tier.id}
                  style={[
                    styles.tierCard,
                    isSelected && styles.tierCardSelected,
                  ]}
                >
                  <Image
                    source={tier.image}
                    style={styles.tierImage}
                    contentFit="cover"
                  />
                  <View style={styles.tierTextArea}>
                    <Typography
                      title={tier.title}
                      fontSize={SIZES.title}
                      style={styles.bold}
                    />
                    <Typography
                      title={tier.description}
                      fontSize={SIZES.caption}
                      color={COLORS.grey6}
                      textMarginTop={4}
                    />
                    <View style={styles.tierAction}>
                      {isSelected ? (
                        <Button color="primary" style={styles.pillButton}>
                          <Typography
                            title="Selected"
                            fontSize={SIZES.caption}
                            color={COLORS.white}
                            style={styles.bold}
                          />
                        </Button>
                      ) : (
                        <Button
                          bordered
                          style={[styles.pillButton, styles.pillButtonGhost]}
                          onPress={() => setSelectedTier(tier.id)}
                        >
                          <Typography
                            title="Select"
                            fontSize={SIZES.caption}
                            color={COLORS.black}
                            style={styles.bold}
                          />
                        </Button>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
          <Button color="primary" style={styles.ctaButton}>
            <Typography
              title="Join Hareth Gold"
              fontSize={SIZES.title}
              color={COLORS.white}
              style={styles.bold}
            />
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default React.memo(HarethGoldContent);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    paddingBottom: 120,
    
  },
  bannerContainer: {
    padding: SIZES.padding,
  },
  bannerImage: {
    width: "100%",
    height: 218,
    borderRadius: 12,
  },
  section: {
    paddingHorizontal: SIZES.padding,
    paddingTop: 8,
    paddingBottom: 16,
  },
  bold: {
    fontWeight: "700",
  },
  tiers: {
    marginTop: 12,
    gap: 12,
  } as any,
  tierCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    ...COLORS.shadow,
  } as any,
  tierCardSelected: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  tierImage: {
    width: 96,
    height: 96,
    borderRadius: 12,
  },
  tierTextArea: {
    flex: 1,
  },
  tierAction: {
    marginTop: 8,
  },
  pillButton: {
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 12,
    minHeight: 32,
    alignSelf: "flex-start",
  },
  pillButtonGhost: {
    borderColor: COLORS.primary,
  },
  ctaContainer: {
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.gray1,
    marginBottom: 80,
  },
  ctaButton: {
    height: 48,
    borderRadius: 12,
    marginTop: 20,
  },
});
