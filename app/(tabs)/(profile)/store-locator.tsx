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
  const { t } = useLocal();

  const stores: StoreItem[] = [
    {
      id: "1",
      name: t("storeLocator.Ahmadi"),
      address: t("storeLocator.East Ahmadi-Block 6 -Parcel 900010 - Ground Floor- Shop 1 -PACI Unit NO"),
      phone: "+9659001 2031",
      distanceKm: "https://maps.app.goo.gl/6N2R6DJGsF7r3WGS8",
  
    },
    {
      id: "2",
      name: t("storeLocator.Al-Aqeela"),
      address: t("storeLocator.Al- Bairaq Mall, 85 Street 250 - Block 5 - Floor 1 Basement - Shop B7"),
      phone: "+9669093 2536",
      distanceKm: "https://maps.app.goo.gl/KXs5Mj4yqHYBzEkj9"
    },
    {
      id: "3",
      name: t("storeLocator.Sulaibikhat"),
      address: t("storeLocator.Unit BO1 Ghornata - Block 3 - Jahra Ewy - Parcel 900016 - Mall - Floor 1 Basement - Unit BO1 - PACI Unit NO 19091897"),
      phone: "+9669003 9248",
      distanceKm: "https://maps.app.goo.gl/v2AW6VU4QarpxNUj7"
    },
    {
      id: "4",
      name: t("storeLocator.Seville"),
      address: t("storeLocator.Eshbiliya - Block 3 - St 315 - Ground Floor - Shop 24 - Unit NO 19951965"),
      phone: "+9669097 0473",
      distanceKm:"https://maps.app.goo.gl/hfyVbLse692WuFww9"
    },
    {
      id: "5",
      name: t("storeLocator.Saad Al-Abdullah"),
      address: t("storeLocator.Aljahra - Saad Al Abdullah City - Block 1 -St 22"),
      phone: "+9669095 7025",
      distanceKm: "https://maps.app.goo.gl/KXs5Mj4yqHYBzEkj9"
    },
    {
      id: "6",
      name: t("storeLocator.Hiawin"),
      address: t("storeLocator.Aljahra - Block 4 - Street 4 - Commercial Building - Ground Floor - Shop 15"),
      phone: "+9669097 6056",
      distanceKm:"https://maps.app.goo.gl/Qt6GQ4tCQ3fGVWXi7"
    },
    {
      id: "7",
      name: t("storeLocator.Khan Khalili"),
      address: t("storeLocator.Aljahra - Ain galout street - Khan Khalili"),
      phone: "+9669092 0745",
      distanceKm: "https://maps.app.goo.gl/QLx11zodxANior5z6"
    },
    {
      id: "8",
      name: t("storeLocator.We find"),
      address: t("storeLocator.Jahra - Block 2 - St 2 Lane 1 Parcel 2121 - Building 31 - Ground Floor -"),
      phone: "+9669098 5062",
      distanceKm: "https://maps.app.goo.gl/SXRnDxL26ZKAWFns9"
    },
    {
      id: "9",
      name: t("storeLocator.Andalusia 10th century"),
      address: t("storeLocator.#9 Ground floor، 200 6 St, Andalous - Block 10"),
      phone: "+9669110 4169",
      distanceKm: "https://maps.app.goo.gl/U7wFLcuwkDxFtB2n8"
    },
    {
      id: "10",
      name: t("storeLocator.Andalusia 3rd century"),
      address: t("storeLocator.Andalus - Block 3 - St 1 - Parcel 219 - Ground Floor - Shop 12"),
      phone: "+9669001 2037",
      distanceKm:"https://maps.app.goo.gl/X6Q7si8Yaa2RfMQM8"
    },
    {
      id: "11",
      name: t("storeLocator.Wara Complex"),
      address: t("storeLocator.Aljahra - Block 5 - Marzouq Al Miteb St - Wara Complex"),
      phone: "+9669098 9534",
      distanceKm: "https://maps.app.goo.gl/3QQb5evGddfi4cMfA"
    },
    {
      id: "12",
      name: t("storeLocator.Jaber Al-Ahmad"),
      address: t("storeLocator.Jaber Al-Ahmad - Block 5 - St 430 - Parcel 900001 - House - Ground Floor - Shop 7 - PACI Unit NO 20644532"),
      phone: "+9669885 7549",
      distanceKm:"https://maps.app.goo.gl/rVxrBvoiDYJUzn7a7"
    },
    {
      id: "13",
      name: t("storeLocator.Descendant"),
      address: t("storeLocator.Jahra - Block 1 - Sulaiyel Mall - Ground Floor - Shop 22 - PACI Unit NO"),
      phone: "+9669096 3762",
      distanceKm: "https://maps.app.goo.gl/YnitMBQXs3q97FtFA"
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
        contentContainerStyle={{
          padding: SIZES.padding,
          paddingTop: SIZES.base,
          paddingBottom: SIZES.padding*8,
        }}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={7}
        renderItem={({ item }) => <StoreCard store={item} />}
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
