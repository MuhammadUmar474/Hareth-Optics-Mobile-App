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
import { ShopifyAddress } from "@/services/home/homeApi";
import { useAddressStore } from "@/store/addressStore";
import { useAuthStore } from "@/store/shopifyStore";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, SafeAreaView, View } from "react-native";

const AddressBook: React.FC = () => {
  const { t } = useLocal();
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

  // Store hooks
  const { 
    addresses, 
    defaultAddressId, 
    loading, 
    error,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    clearError
  } = useAddressStore();
  
  const { accessToken, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (accessToken) {
      fetchAddresses(accessToken);
    }
  }, [accessToken, fetchAddresses]);

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error, [
        { text: "OK", onPress: clearError }
      ]);
    }
  }, [error, clearError]);

  const handleEdit = useCallback(
    (id: string) => {
      const address = addresses.find((addr) => addr.id === id);
      if (address) {
        setEditingAddress({
          id: address.id,
          label: `${address.firstName || ""} ${address.lastName || ""}`.trim() || "Address",
          street: address.address1,
          city: address.city,
          state: address.province,
          zipCode: address.zip,
          country: address.country,
          isDefault: defaultAddressId === address.id,
          iconName: "home" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
        });
        setIsModalVisible(true);
      }
    },
    [addresses, defaultAddressId]
  );

  const handleDelete = useCallback(async (id: string) => {
    if (!accessToken) return;
    
    Alert.alert(
      "Delete Address",
      "Are you sure you want to delete this address?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success = await deleteAddress(accessToken, id);
            if (success) {
              Alert.alert("Success", "Address deleted successfully");
            }
          },
        },
      ]
    );
  }, [accessToken, deleteAddress]);

  const handleSetDefault = useCallback(async (id: string) => {
    if (!accessToken) return;
    
    const success = await setDefaultAddress(accessToken, id);
    if (success) {
      Alert.alert("Success", "Default address updated successfully");
    }
  }, [accessToken, setDefaultAddress]);

  const handleAddAddress = useCallback(
    async (addressData: AddressData) => {
      if (!accessToken) return;
      
      const addressInput = {
        address1: addressData.street,
        address2: null,
        city: addressData.city,
        province: addressData.state,
        country: addressData.country,
        zip: addressData.zipCode,
        phone: null,
        firstName: addressData.label.split(" ")[0] || "",
        lastName: addressData.label.split(" ").slice(1).join(" ") || "",
      };

      let addressId: string | null = null;
      let success = false;
      
      if (editingAddress) {
        // Update existing address
        success = await updateAddress(accessToken, editingAddress.id, addressInput);
        addressId = editingAddress.id;
      } else {
        // Add new address
        addressId = await createAddress(accessToken, addressInput);
        success = addressId !== null;
      }

      if (success && addressId) {
        // Set as default if requested
        if (addressData.isDefault) {
          await setDefaultAddress(accessToken, addressId);
        }
        
        setIsModalVisible(false);
        setEditingAddress(null);
        Alert.alert("Success", editingAddress ? "Address updated successfully" : "Address added successfully");
      }
    },
    [accessToken, editingAddress, createAddress, updateAddress, setDefaultAddress]
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
    ({ item }: { item: ShopifyAddress }) => (
      <AddressCard
        label={`${item.firstName || ""} ${item.lastName || ""}`.trim() || "Address"}
        address={`${item.address1}, ${item.city}, ${item.province} ${item.zip}`}
        isDefault={defaultAddressId === item.id}
        iconName="home"
        onEdit={() => handleEdit(item.id)}
        onDelete={() => handleDelete(item.id)}
        onSetDefault={() => handleSetDefault(item.id)}
      />
    ),
    [defaultAddressId, handleDelete, handleEdit, handleSetDefault]
  );
  if (!isAuthenticated || !accessToken) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
        <Header title={t("profile.menu.addressBook")} />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: SIZES.padding }}>
          <Typography
            title="Please log in to manage your addresses"
            fontSize={SIZES.title}
            color={COLORS.grey29}
            fontFamily="Roboto-Regular"
            style={{ textAlign: "center" }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Header title={t("profile.menu.addressBook")} />
      
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Typography
            title="Loading addresses..."
            fontSize={SIZES.title}
            color={COLORS.grey29}
            fontFamily="Roboto-Regular"
          />
        </View>
      ) : addresses.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: SIZES.padding }}>
          <Typography
            title="No addresses found"
            fontSize={SIZES.title}
            color={COLORS.grey29}
            fontFamily="Roboto-Regular"
            style={{ textAlign: "center", marginBottom: 20 }}
          />
          <Typography
            title="Add your first address to get started"
            fontSize={SIZES.body}
            color={COLORS.grey29}
            fontFamily="Roboto-Regular"
            style={{ textAlign: "center" }}
          />
        </View>
      ) : (
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
      )}
      
      <View style={{ paddingHorizontal: SIZES.padding, paddingBottom: 130 }}>
        <Button
          color="primary"
          style={{ height: 48, borderRadius: 12 }}
          onPress={handleOpenModal}
          disabled={loading}
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
        onSetDefault={async (addressId: string) => {
          if (!accessToken) return false;
          return await setDefaultAddress(accessToken, addressId);
        }}
        editAddress={editingAddress || undefined}
      />
    </SafeAreaView>
  );
};

export default AddressBook;
