import StoreCard, { StoreItem } from "@/components/profile/store-card";
import CustomTextInput from "@/components/ui/custom-text-input";
import Typography from "@/components/ui/custom-typography";
import { Header } from "@/components/ui/header";
import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import { useLocal } from "@/hooks/use-lang";
import React, { useMemo, useState } from "react";
import { FlatList, View } from "react-native";

const StoreLocator: React.FC = () => {
  const [search, setSearch] = useState("");
  const{t}=useLocal()

  const stores: StoreItem[] = [
    {
      id: "1",
      name: "Hareth Optics - Downtown",
      address: "12 King Abdulaziz Rd, Riyadh",
      phone: "+966500000001",
      distanceKm: 1.2,
      lat: 24.7136,
      lng: 46.6753,
    },
    {
      id: "2",
      name: "Hareth Optics - Mall Branch",
      address: "2nd Floor, Hareth Mall, Riyadh",
      phone: "+966500000002",
      distanceKm: 4.5,
      lat: 24.6927,
      lng: 46.7240,
    },
    {
      id: "3",
      name: "Hareth Optics ",
      address: "Corniche Walk, Jeddah",
      phone: "+966500000003",
      distanceKm: 848.7,
      lat: 21.5433,
      lng: 39.1728,
    },
  ];

  const filteredStores = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return stores;
    return stores.filter((s) =>
      [s.name, s.address].some((v) => v.toLowerCase().includes(q))
    );
  }, [search]);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Header title={t("profile.menu.storeLocator")} />
      <View style={{ padding: SIZES.padding, paddingBottom: 0 }}>
        <CustomTextInput
          iconName="search"
          placeHolder="Search by area or store name"
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={COLORS.gray}
          height={48}
        />
      </View>

      <FlatList
        data={filteredStores}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: SIZES.padding, paddingTop: SIZES.base }}
        removeClippedSubviews
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={7}
        renderItem={({ item }) => (
          <StoreCard store={item} />
        )}
        ListEmptyComponent={() => (
          <View style={{ padding: SIZES.padding }}>
            <Typography title="No stores found" color={COLORS.grayText} />
          </View>
        )}
      />
    </View>
  );
};

export default StoreLocator;