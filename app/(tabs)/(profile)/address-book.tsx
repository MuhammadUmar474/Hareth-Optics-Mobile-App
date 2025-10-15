import AddressCard from "@/components/profile/address-card";
import Button from "@/components/ui/custom-button";
import Typography from "@/components/ui/custom-typography";
import { Header } from "@/components/ui/header";
import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import React, { useCallback, useMemo } from "react";
import { FlatList, SafeAreaView, View } from "react-native";

const AddressBook: React.FC = () => {
  const addresses = useMemo(
    () => [
      {
        id: "1",
        label: "Home",
        address: "123 Elm Street, Apt 4B, Springfield, IL 62704",
        isDefault: true,
        iconName: "home",
      },
      {
        id: "2",
        label: "Work",
        address: "456 Oak Avenue, Suite 200, Springfield, IL 62704",
        isDefault: false,
        iconName: "briefcase",
      },
      {
        id: "3",
        label: "Vacation Home",
        address: "789 Pine Lane, Springfield, IL 62704",
        isDefault: false,
        iconName: "home",
      },
    ],
    []
  );

  const handleEdit = useCallback((id: string) => {
    // TODO: Navigate to edit form
  }, []);

  const handleDelete = useCallback((id: string) => {
    // TODO: Implement delete flow
  }, []);

  const handleSetDefault = useCallback((id: string) => {
    // TODO: Update default selection
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: (typeof addresses)[number] }) => (
      <AddressCard
        label={item.label}
        address={item.address}
        isDefault={item.isDefault}
        iconName={item.iconName}
        onEdit={() => handleEdit(item.id)}
        onDelete={() => handleDelete(item.id)}
        onSetDefault={() => handleSetDefault(item.id)}
      />
    ),
    [addresses, handleDelete, handleEdit, handleSetDefault]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Header title="Address Book" />
      <FlatList
        contentContainerStyle={{ padding: SIZES.padding, paddingBottom: 88 }}
        data={addresses}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        removeClippedSubviews
        maxToRenderPerBatch={6}
        windowSize={5}
        showsVerticalScrollIndicator={false}
      />
      <View style={{ paddingHorizontal: SIZES.padding ,paddingBottom: 130}}>
        <Button color="primary" style={{ height: 48, borderRadius: 12 }}>
          <Typography
            title="Add New Address"
            color={COLORS.white}
            fontSize={SIZES.title}
            style={{ fontWeight: "800" }}
          />
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default AddressBook;
