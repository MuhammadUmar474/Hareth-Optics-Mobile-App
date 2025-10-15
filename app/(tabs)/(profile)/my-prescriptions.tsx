import PrescriptionCard, { PrescriptionItem } from "@/components/profile/prescription-card";
import CustomTextInput from "@/components/ui/custom-text-input";
import Typography from "@/components/ui/custom-typography";
import { Header } from "@/components/ui/header";
import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import React, { useMemo, useState } from "react";
import { FlatList, View } from "react-native";

const MyPrescriptions: React.FC = () => {
  const [search, setSearch] = useState("");

  const prescriptions: PrescriptionItem[] = [
    {
      id: "1",
      name: "Distance",
      date: "2025-07-12",
      rightSphere: "-1.25",
      rightCylinder: "-0.50",
      rightAxis: "180",
      leftSphere: "-1.00",
      leftCylinder: "-0.25",
      leftAxis: "170",
      pd: "63",
      notes: "Anti-glare recommended",
    },
    {
      id: "2",
      name: "Reading",
      date: "2025-05-03",
      rightSphere: "+1.25",
      leftSphere: "+1.25",
      pd: "62",
    },
  ];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return prescriptions;
    return prescriptions.filter((p) => [p.name, p.notes].filter(Boolean).some((v) => v!.toLowerCase().includes(q)));
  }, [search]);


  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Header title="My Prescriptions" />
      <View style={{ padding: SIZES.padding, paddingBottom: 0 }}>
        <CustomTextInput
          iconName="search"
          placeHolder="Search prescriptions"
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={COLORS.gray}
          height={48}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: SIZES.padding, paddingTop: SIZES.base, paddingBottom: 100 }}
        removeClippedSubviews
        initialNumToRender={6}
        showsVerticalScrollIndicator={false}
        maxToRenderPerBatch={6}
        windowSize={7}
        renderItem={({ item }) => (
          <PrescriptionCard item={item} />
        )}
        ListEmptyComponent={() => (
          <View style={{ padding: SIZES.padding }}>
            <Typography title="No prescriptions yet" color={COLORS.grayText} />
          </View>
        )}
      />

 
    </View>
  );
};

export default MyPrescriptions;


