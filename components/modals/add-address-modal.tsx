import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import Typography from "../ui/custom-typography";

interface AddAddressModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (address: AddressData) => void;
  editAddress?: {
    id: string;
    label: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
    iconName: keyof typeof Ionicons.glyphMap;
  };
}

export interface AddressData {
  id?: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  iconName: keyof typeof Ionicons.glyphMap;
}

const AddAddressModal: React.FC<AddAddressModalProps> = ({
  visible,
  onClose,
  onSave,
  editAddress,
}) => {
  const [formData, setFormData] = useState<AddressData>({
    label: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Kuwait",
    isDefault: false,
    iconName: "home",
  });

  const [errors, setErrors] = useState<Partial<AddressData>>({});

  useEffect(() => {
    if (editAddress) {
      setFormData({
        id: editAddress.id,
        label: editAddress.label,
        street: editAddress.street,
        city: editAddress.city,
        state: editAddress.state,
        zipCode: editAddress.zipCode,
        country: editAddress.country,
        isDefault: editAddress.isDefault,
        iconName: editAddress.iconName,
      });
    } else {
      setFormData({
        label: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "Kuwait",
        isDefault: false,
        iconName: "home",
      });
    }
    setErrors({});
  }, [editAddress, visible]);

  const validateForm = (): boolean => {
    const newErrors: Partial<AddressData> = {};

    if (!formData.label.trim()) newErrors.label = "Label is required";
    if (!formData.street.trim())
      newErrors.street = "Street address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const iconOptions = [
    { name: "home", label: "Home" },
    { name: "briefcase", label: "Work" },
    { name: "location", label: "Other" },
  ] as const;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Typography
              title="Cancel"
              fontSize={moderateScale(16)}
              color={COLORS.primary}
              fontFamily="Inter-SemiBold"
            />
          </TouchableOpacity>
          <Typography
            title={editAddress ? "Edit Address" : "Add New Address"}
            fontSize={moderateScale(18)}
            color={COLORS.secondary}
            fontFamily="Inter-Bold"
          />
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Typography
              title="Save"
              fontSize={moderateScale(16)}
              color={COLORS.primary}
              fontFamily="Inter-SemiBold"
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Typography
              title="Address Label"
              fontSize={moderateScale(16)}
              color={COLORS.secondary}
              fontFamily="Inter-SemiBold"
              style={styles.label}
            />
            <TextInput
              style={[styles.input, errors.label && styles.inputError]}
              value={formData.label}
              onChangeText={(text) => setFormData({ ...formData, label: text })}
              placeholder="e.g., Home, Work, Vacation"
              placeholderTextColor={COLORS.grey14}
            />
            {errors.label && (
              <Typography
                title={errors.label}
                fontSize={moderateScale(12)}
                color={COLORS.danger}
                style={styles.errorText}
              />
            )}
          </View>

          <View style={styles.section}>
            <Typography
              title="Street Address"
              fontSize={moderateScale(16)}
              color={COLORS.secondary}
              fontFamily="Inter-SemiBold"
              style={styles.label}
            />
            <TextInput
              style={[styles.input, errors.street && styles.inputError]}
              value={formData.street}
              onChangeText={(text) =>
                setFormData({ ...formData, street: text })
              }
              placeholder="Enter street address"
              placeholderTextColor={COLORS.grey14}
              multiline
            />
            {errors.street && (
              <Typography
                title={errors.street}
                fontSize={moderateScale(12)}
                color={COLORS.danger}
                style={styles.errorText}
              />
            )}
          </View>

          <View style={styles.row}>
            <View style={[styles.section, { flex: 1, marginRight: scale(8) }]}>
              <Typography
                title="City"
                fontSize={moderateScale(16)}
                color={COLORS.secondary}
                fontFamily="Inter-SemiBold"
                style={styles.label}
              />
              <TextInput
                style={[styles.input, errors.city && styles.inputError]}
                value={formData.city}
                onChangeText={(text) =>
                  setFormData({ ...formData, city: text })
                }
                placeholder="Enter city"
                placeholderTextColor={COLORS.grey14}
              />
              {errors.city && (
                <Typography
                  title={errors.city}
                  fontSize={moderateScale(12)}
                  color={COLORS.danger}
                  style={styles.errorText}
                />
              )}
            </View>

            <View style={[styles.section, { flex: 1, marginLeft: scale(8) }]}>
              <Typography
                title="State"
                fontSize={moderateScale(16)}
                color={COLORS.secondary}
                fontFamily="Inter-SemiBold"
                style={styles.label}
              />
              <TextInput
                style={[styles.input, errors.state && styles.inputError]}
                value={formData.state}
                onChangeText={(text) =>
                  setFormData({ ...formData, state: text })
                }
                placeholder="Enter state"
                placeholderTextColor={COLORS.grey14}
              />
              {errors.state && (
                <Typography
                  title={errors.state}
                  fontSize={moderateScale(12)}
                  color={COLORS.danger}
                  style={styles.errorText}
                />
              )}
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.section, { flex: 1, marginRight: scale(8) }]}>
              <Typography
                title="ZIP Code"
                fontSize={moderateScale(16)}
                color={COLORS.secondary}
                fontFamily="Inter-SemiBold"
                style={styles.label}
              />
              <TextInput
                style={[styles.input, errors.zipCode && styles.inputError]}
                value={formData.zipCode}
                onChangeText={(text) =>
                  setFormData({ ...formData, zipCode: text })
                }
                placeholder="Enter ZIP code"
                placeholderTextColor={COLORS.grey14}
                keyboardType="numeric"
              />
              {errors.zipCode && (
                <Typography
                  title={errors.zipCode}
                  fontSize={moderateScale(12)}
                  color={COLORS.danger}
                  style={styles.errorText}
                />
              )}
            </View>

            <View style={[styles.section, { flex: 1, marginLeft: scale(8) }]}>
              <Typography
                title="Country"
                fontSize={moderateScale(16)}
                color={COLORS.secondary}
                fontFamily="Inter-SemiBold"
                style={styles.label}
              />
              <TextInput
                style={styles.input}
                value={formData.country}
                onChangeText={(text) =>
                  setFormData({ ...formData, country: text })
                }
                placeholder="Enter country"
                placeholderTextColor={COLORS.grey14}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Typography
              title="Icon"
              fontSize={moderateScale(16)}
              color={COLORS.secondary}
              fontFamily="Inter-SemiBold"
              style={styles.label}
            />
            <View style={styles.iconOptions}>
              {iconOptions.map((option) => (
                <TouchableOpacity
                  key={option.name}
                  style={[
                    styles.iconOption,
                    formData.iconName === option.name && styles.selectedIcon,
                  ]}
                  onPress={() =>
                    setFormData({ ...formData, iconName: option.name })
                  }
                >
                  <Ionicons
                    name={option.name as any}
                    size={moderateScale(20)}
                    color={
                      formData.iconName === option.name
                        ? COLORS.white
                        : COLORS.primary
                    }
                  />
                  <Typography
                    title={option.label}
                    fontSize={moderateScale(12)}
                    color={
                      formData.iconName === option.name
                        ? COLORS.white
                        : COLORS.secondary
                    }
                    fontFamily="Inter-Medium"
                    style={styles.iconLabel}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() =>
                setFormData({ ...formData, isDefault: !formData.isDefault })
              }
            >
              <View
                style={[
                  styles.checkbox,
                  formData.isDefault && styles.checkedBox,
                ]}
              >
                {formData.isDefault && (
                  <Ionicons
                    name="checkmark"
                    size={moderateScale(16)}
                    color={COLORS.white}
                  />
                )}
              </View>
              <Typography
                title="Set as default address"
                fontSize={moderateScale(16)}
                color={COLORS.secondary}
                fontFamily="Inter-Medium"
                style={styles.checkboxLabel}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey4,
  },
  cancelButton: {
    paddingVertical: verticalScale(8),
  },
  saveButton: {
    paddingVertical: verticalScale(8),
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(16),
  },
  section: {
    marginTop: verticalScale(20),
  },
  row: {
    flexDirection: "row",
  },
  label: {
    marginBottom: verticalScale(8),
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.grey4,
    borderRadius: scale(8),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(12),
    fontSize: moderateScale(16),
    color: COLORS.secondary,
    backgroundColor: COLORS.white,
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  errorText: {
    marginTop: verticalScale(4),
  },
  iconOptions: {
    flexDirection: "row",
    gap: scale(12),
  },
  iconOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  selectedIcon: {
    backgroundColor: COLORS.primary,
  },
  iconLabel: {
    marginLeft: scale(8),
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: verticalScale(8),
  },
  checkbox: {
    width: scale(20),
    height: scale(20),
    borderWidth: 2,
    borderColor: COLORS.grey4,
    borderRadius: scale(4),
    alignItems: "center",
    justifyContent: "center",
    marginRight: scale(12),
  },
  checkedBox: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkboxLabel: {
    flex: 1,
  },
});

export default AddAddressModal;
