import AddAddressModal, {
  AddressData,
} from "@/components/modals/add-address-modal";
import AddressCard from "@/components/profile/address-card";
import Button from "@/components/ui/custom-button";
import Typography from "@/components/ui/custom-typography";
import { Header } from "@/components/ui/header";
import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import { useLocal } from "@/hooks/use-lang";
import React, { useCallback, useState } from "react";
import { FlatList, SafeAreaView, View } from "react-native";

const AddressBook: React.FC = () => {
const{t}=useLocal()
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<{
    id: string;
    label: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
    iconName: keyof typeof import("@expo/vector-icons").Ionicons.glyphMap;
  } | null>(null);
  const [addresses, setAddresses] = useState([
    {
      id: "1",
      label: "Home",
      address: "123 Elm Street, Apt 4B, Springfield, IL 62704",
      isDefault: true,
      iconName:
        "home" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
    },
    {
      id: "2",
      label: "Work",
      address: "456 Oak Avenue, Suite 200, Springfield, IL 62704",
      isDefault: false,
      iconName:
        "briefcase" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
    },
    {
      id: "3",
      label: "Vacation Home",
      address: "789 Pine Lane, Springfield, IL 62704",
      isDefault: false,
      iconName:
        "home" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
    },
  ]);

  const handleEdit = useCallback(
    (id: string) => {
      const address = addresses.find((addr) => addr.id === id);
      if (address) {
        // Parse the address to extract components
        const addressParts = address.address.split(", ");
        const street = addressParts[0] || "";
        const cityStateZip = addressParts[1] || "";
        const cityStateZipParts = cityStateZip.split(" ");
        const city = cityStateZipParts.slice(0, -2).join(" ") || "";
        const state = cityStateZipParts[cityStateZipParts.length - 2] || "";
        const zipCode = cityStateZipParts[cityStateZipParts.length - 1] || "";

        setEditingAddress({
          id: address.id,
          label: address.label,
          street,
          city,
          state,
          zipCode,
          country: "Kuwait",
          isDefault: address.isDefault,
          iconName:
            address.iconName as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
        });
        setIsModalVisible(true);
      }
    },
    [addresses]
  );

  const handleDelete = useCallback((id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  }, []);

  const handleSetDefault = useCallback((id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  }, []);

  const handleAddAddress = useCallback(
    (addressData: AddressData) => {
      if (editingAddress) {
        // Update existing address
        setAddresses((prev) =>
          prev.map((addr) =>
            addr.id === editingAddress.id
              ? {
                  ...addr,
                  label: addressData.label,
                  address: `${addressData.street}, ${addressData.city}, ${addressData.state} ${addressData.zipCode}`,
                  isDefault: addressData.isDefault,
                  iconName:
                    addressData.iconName as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
                }
              : addressData.isDefault
              ? { ...addr, isDefault: false }
              : addr
          )
        );
        setEditingAddress(null);
      } else {
        // Add new address
        const newAddress = {
          id: Date.now().toString(),
          label: addressData.label,
          address: `${addressData.street}, ${addressData.city}, ${addressData.state} ${addressData.zipCode}`,
          isDefault: addressData.isDefault,
          iconName:
            addressData.iconName as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
        };

        if (addressData.isDefault) {
          setAddresses((prev) =>
            prev.map((addr) => ({ ...addr, isDefault: false }))
          );
        }

        setAddresses((prev) => [...prev, newAddress]);
      }
    },
    [editingAddress]
  );

  const handleOpenModal = useCallback(() => {
    setEditingAddress(null);
    setIsModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalVisible(false);
    setEditingAddress(null);
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
    [handleDelete, handleEdit, handleSetDefault]
  );
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Header title={t("profile.menu.addressBook")} />
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
      <View style={{ paddingHorizontal: SIZES.padding, paddingBottom: 130 }}>
        <Button
          color="primary"
          style={{ height: 48, borderRadius: 12 }}
          onPress={handleOpenModal}
        >
          <Typography
            title="Add New Address"
            color={COLORS.white}
            fontSize={SIZES.title}
            style={{ fontWeight: "800" }}
          />
        </Button>
      </View>

      <AddAddressModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        onSave={handleAddAddress}
        editAddress={editingAddress || undefined}
      />
    </SafeAreaView>
  );
};

export default AddressBook;
