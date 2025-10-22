import Typography from "@/components/ui/custom-typography";
import Input from "@/components/ui/input";
import { COLORS } from "@/constants/colors";
import { LensTypeOption, lensTypeOptions } from "@/constants/data";
import { useLocal } from "@/hooks/use-lang";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

export interface PrescriptionData {
  lensType: string;
  leftEye: string;
  rightEye: string;
  lensTint: string;
  blueLightFilter: string;
}

interface LensTypeProps {
  onPrescriptionChange?: (prescription: PrescriptionData | null) => void;
  initialData?: PrescriptionData;
}

const LensType: React.FC<LensTypeProps> = ({
  onPrescriptionChange,
  initialData,
}) => {
  const [selectedLensType, setSelectedLensType] = useState<number>(1);
  const [leftEye, setLeftEye] = useState<string>("");
  const [rightEye, setRightEye] = useState<string>("");
  const [lensTint, setLensTint] = useState<string>("Clear");
  const [blueLightFilter, setBlueLightFilter] = useState<string>("No");
  const { isRtl, t } = useLocal();
  const onPrescriptionChangeRef = useRef(onPrescriptionChange);
  onPrescriptionChangeRef.current = onPrescriptionChange;

  useEffect(() => {
    if (initialData) {
      setLeftEye(initialData.leftEye);
      setRightEye(initialData.rightEye);
      setLensTint(initialData.lensTint);
      setBlueLightFilter(initialData.blueLightFilter);

      const lensTypeOption = lensTypeOptions.find(
        (opt) => opt.name === initialData.lensType
      );
      if (lensTypeOption) {
        setSelectedLensType(lensTypeOption.id);
      }
    }
  }, [initialData]);

  useEffect(() => {
    const prescription: PrescriptionData = {
      lensType:
        lensTypeOptions.find((opt) => opt.id === selectedLensType)?.name ||
        "Single Vision",
      leftEye,
      rightEye,
      lensTint,
      blueLightFilter,
    };
    const isComplete = leftEye.trim() !== "" && rightEye.trim() !== "";

    onPrescriptionChangeRef.current?.(isComplete ? prescription : null);
  }, [selectedLensType, leftEye, rightEye, lensTint, blueLightFilter]);

  const dynamicStyles = useMemo(
    () =>
      StyleSheet.create({
        inputRow: {
          flexDirection: isRtl ? "row-reverse" : "row",
          gap: scale(12),
          marginBottom: verticalScale(12),
        },
        inputText: {
          fontSize: scale(14),
          color: COLORS.black,
          textAlign: isRtl ? "right" : "left",
        },
        inputLabel: {
          marginBottom: verticalScale(6),
          fontWeight: "500",
          textAlign: isRtl ? "right" : "left",
        },
        sectionTitle: {
          marginBottom: verticalScale(12),
          fontWeight: "600",
          textAlign: isRtl ? "right" : "left",
        },
      }),
    [isRtl]
  );
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
                  selectedLensType === option.id ? COLORS.grey16 : COLORS.grey16
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
          textAlign={isRtl ? "right" : "left"}
          style={styles.prescriptionTitle}
        />

        <View style={dynamicStyles.inputRow}>
          <View style={styles.inputColumn}>
            <Typography
              title="Left Eye (L)"
              fontSize={scale(13)}
              color={COLORS.grey33}
              fontFamily="Roboto-Regular"
              style={dynamicStyles.inputLabel}
            />
            <Input
              value={leftEye}
              onChangeText={setLeftEye}
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
              title="Right Eye (R)"
              fontSize={scale(13)}
              color={COLORS.grey33}
              fontFamily="Roboto-Regular"
              style={dynamicStyles.inputLabel}
            />
            <Input
              value={rightEye}
              onChangeText={setRightEye}
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
              title="Lens Tint"
              fontSize={scale(13)}
              color={COLORS.grey33}
              fontFamily="Roboto-Regular"
              style={dynamicStyles.inputLabel}
            />
            <Input
              value={lensTint}
              onChangeText={setLensTint}
              placeholder="Clear"
              containerStyle={styles.inputContainer}
              inputContainerStyle={styles.inputField}
              inputStyle={dynamicStyles.inputText}
              placeholderTextColor={COLORS.grey10}
            />
          </View>

          <View style={styles.inputColumn}>
            <Typography
              title="Blue Light Filter"
              fontSize={scale(13)}
              color={COLORS.grey33}
              fontFamily="Roboto-Regular"
              style={dynamicStyles.inputLabel}
            />
            <Input
              value={blueLightFilter}
              onChangeText={setBlueLightFilter}
              placeholder="No"
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
