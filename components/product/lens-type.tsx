import Typography from "@/components/ui/custom-typography";
import Input from "@/components/ui/input";
import { COLORS } from "@/constants/colors";
import { LensTypeOption, lensTypeOptions } from "@/constants/data";
import { useLocal } from "@/hooks/use-lang";
import React, { useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

const LensType: React.FC = () => {
  const [selectedLensType, setSelectedLensType] = useState<number>(1);
  const [sphereRight, setSphereRight] = useState<string>("");
  const [sphereLeft, setSphereLeft] = useState<string>("");
  const [cylinderRight, setCylinderRight] = useState<string>("");
  const [cylinderLeft, setCylinderLeft] = useState<string>("");
  const {isRtl,t}=useLocal();
  const dynamicStyles=useMemo(()=>StyleSheet.create({
    inputRow: {
      flexDirection: isRtl?"row-reverse":"row",
      gap: scale(12),
      marginBottom: verticalScale(12),
    },  
    inputText: {
      fontSize: scale(14),
      color: COLORS.black,
      textAlign:isRtl?"right":"left"
    },
    inputLabel: {
      marginBottom: verticalScale(6),
      fontWeight: "500",
       textAlign:isRtl?"right":"left"
    },
    sectionTitle: {
      marginBottom: verticalScale(12),
      fontWeight: "600",
      textAlign:isRtl?"right":"left"
    },
  }),[isRtl])
  return (
    <View style={styles.container}>
      {/* Lens Type Section */}
      <View style={styles.section}>
        <Typography
          title={t("eyeglassesDetails.lensType")}
          fontSize={scale(16)}
          fontFamily="Poppins-Bold"
          color={COLORS.black}
          style={dynamicStyles.sectionTitle}
        />
        <View style={styles.lensTypeContainer}>
          {lensTypeOptions.map((option: LensTypeOption) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.lensTypeButton,
                selectedLensType === option.id && styles.lensTypeButtonSelected,
              ]}
              onPress={() => setSelectedLensType(option.id)}
            >
              <Typography
                title={t(option.name)}
                fontSize={scale(15)}
                color={
                  selectedLensType === option.id ? COLORS.black : COLORS.black
                }
                
                fontFamily="Roboto-Bold"
                style={styles.lensTypeName}
              />
              <Typography
                title={t(option.description)}
                fontSize={scale(12)}
                color={
                  selectedLensType === option.id
                    ? COLORS.grey16
                    : COLORS.grey16
                }
                fontFamily="Roboto-Regular"
                style={styles.lensTypeDescription}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Enter Your Prescription Section */}
      <View style={styles.prescriptionSection}>
        <Typography
          title={t("eyeglassesDetails.enterYourPrescription")}
          fontSize={scale(16)}
          fontFamily="Poppins-Bold"
          color={COLORS.black}
          textAlign={isRtl?"right":"left"}
          style={styles.prescriptionTitle}
        />

        <View style={dynamicStyles.inputRow}>
          <View style={styles.inputColumn}>
            <Typography
              title={t("eyeglassesDetails.sphereRight")}
              fontSize={scale(13)}
              color={COLORS.grey33}
              fontFamily="Roboto-Regular"
              style={dynamicStyles.inputLabel}
            />
            <Input
              value={sphereRight}
              onChangeText={setSphereRight}
              placeholder="-2.50"
              keyboardType="numeric"
              containerStyle={styles.inputContainer}
              inputContainerStyle={styles.inputField}
              inputStyle={dynamicStyles.inputText}
              placeholderTextColor={COLORS.grey10}
            />
          </View>

          <View style={styles.inputColumn}>
            <Typography
              title={t("eyeglassesDetails.sphereLeft")}
              fontSize={scale(13)}
              color={COLORS.grey33}
              fontFamily="Roboto-Regular"
              style={dynamicStyles.inputLabel}
            />
            <Input
              value={sphereLeft}
              onChangeText={setSphereLeft}
              placeholder="-2.75"
              keyboardType="numeric"
              containerStyle={styles.inputContainer}
              inputContainerStyle={styles.inputField}
              inputStyle={dynamicStyles.inputText}
              placeholderTextColor={COLORS.grey10}
            />
          </View>
        </View>

        <View style={dynamicStyles.inputRow}>
          <View style={styles.inputColumn}>
            <Typography
              title={t("eyeglassesDetails.cylinderRight")}
              fontSize={scale(13)}
              color={COLORS.grey33}
              fontFamily="Roboto-Regular"
              style={dynamicStyles.inputLabel}
            />
            <Input
              value={cylinderRight}
              onChangeText={setCylinderRight}
              placeholder="-0.50"
              keyboardType="numeric"
              containerStyle={styles.inputContainer}
              inputContainerStyle={styles.inputField}
              inputStyle={dynamicStyles.inputText}
              placeholderTextColor={COLORS.grey10}
            />
          </View>

          <View style={styles.inputColumn}>
            <Typography
              title={t("eyeglassesDetails.cylinderLeft")}
              fontSize={scale(13)}
              color={COLORS.grey33}
              fontFamily="Roboto-Regular"
              style={dynamicStyles.inputLabel}
            />
            <Input
              value={cylinderLeft}
              onChangeText={setCylinderLeft}
              placeholder="-0.50"
              keyboardType="numeric"
              containerStyle={styles.inputContainer}
              inputContainerStyle={styles.inputField}
              inputStyle={dynamicStyles.inputText}
              placeholderTextColor={COLORS.grey10}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.uploadButton}>
          <Typography
            title={t("eyeglassesDetails.uploadPrescription")}
            fontSize={scale(14)}
            color={COLORS.primary}
            fontFamily="Roboto-Bold"
            style={styles.uploadButtonText}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LensType;

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  section: {
    marginBottom: verticalScale(24),
  },

  lensTypeContainer: {
    gap: scale(12),
  },
  lensTypeButton: {
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    borderRadius: scale(10),
    borderWidth: 1,
    borderColor: COLORS.grey4,
    backgroundColor: COLORS.white,
    alignItems: "center",
  },
  lensTypeButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    borderWidth: 2,
  },
  lensTypeName: {
    marginBottom: verticalScale(4),
    fontWeight: "600",
  },
  lensTypeDescription: {
    textAlign: "center",
  },
  prescriptionSection: {
    backgroundColor: COLORS.white,
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: COLORS.grey4,
    padding: scale(16),
    marginBottom: verticalScale(24),
  },
  prescriptionTitle: {
    marginBottom: verticalScale(16),
    fontWeight: "600",
  },
  
  inputColumn: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 0,
  },
  inputField: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.grey4,
    borderRadius: scale(8),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
  },

  uploadButton: {
    backgroundColor: COLORS.white,
    paddingVertical: verticalScale(14),
    borderRadius: scale(10),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginTop: verticalScale(4),
  },
  uploadButtonText: {
    fontWeight: "600",
  },
});

