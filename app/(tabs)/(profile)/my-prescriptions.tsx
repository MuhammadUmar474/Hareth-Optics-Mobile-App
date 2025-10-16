import PrescriptionCard, {
  PrescriptionItem,
} from "@/components/profile/prescription-card";
import CustomTextInput from "@/components/ui/custom-text-input";
import Typography from "@/components/ui/custom-typography";
import { Header } from "@/components/ui/header";
import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const MyPrescriptions: React.FC = () => {
  const [search, setSearch] = useState("");
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
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
  ]);

  const [newPrescription, setNewPrescription] = useState({
    title: "",
    sphLeft: "",
    sphRight: "",
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return prescriptions;
    return prescriptions.filter((p) =>
      [p.name, p.notes]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q))
    );
  }, [search, prescriptions]);

  const handleAddPrescription = useCallback(() => {
    if (
      newPrescription.title.trim() &&
      newPrescription.sphLeft.trim() &&
      newPrescription.sphRight.trim()
    ) {
      const prescription: PrescriptionItem = {
        id: Date.now().toString(),
        name: newPrescription.title,
        date: new Date().toISOString().split("T")[0],
        rightSphere: newPrescription.sphRight,
        leftSphere: newPrescription.sphLeft,
      };

      setPrescriptions((prev) => [...prev, prescription]);
      setNewPrescription({ title: "", sphLeft: "", sphRight: "" });
    }
  }, [newPrescription]);

  const handleDeletePrescription = useCallback(
    (prescription: PrescriptionItem) => {
      setPrescriptions((prev) => prev.filter((p) => p.id !== prescription.id));
    },
    []
  );

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

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: verticalScale(100) }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ padding: SIZES.padding, paddingTop: SIZES.base }}>
          {filtered.map((item) => (
            <PrescriptionCard
              key={item.id}
              item={item}
              onDelete={handleDeletePrescription}
            />
          ))}

          {filtered.length === 0 && (
            <View style={{ padding: SIZES.padding }}>
              <Typography
                title="No prescriptions yet"
                color={COLORS.grayText}
              />
            </View>
          )}
        </View>

        {/* Add Prescription Form */}
        <View style={styles.addPrescriptionCard}>
          <Typography
            title="Add prescription"
            fontSize={moderateScale(18)}
            color={COLORS.secondary}
            fontFamily="Inter-Bold"
            style={styles.cardTitle}
          />

          <View style={styles.formGroup}>
            <Typography
              title="Title"
              fontSize={moderateScale(14)}
              color={COLORS.secondary}
              fontFamily="Inter-Medium"
              style={styles.label}
            />
            <TextInput
              style={styles.input}
              value={newPrescription.title}
              onChangeText={(text) =>
                setNewPrescription((prev) => ({ ...prev, title: text }))
              }
              placeholder="e.g., Dr. Ahmed 2025"
              placeholderTextColor={COLORS.grey14}
            />
          </View>

          <View style={styles.inputRow}>
            <View style={styles.formGroup}>
              <Typography
                title="SPH Left"
                fontSize={moderateScale(14)}
                color={COLORS.secondary}
                fontFamily="Inter-Medium"
                style={styles.label}
              />
              <TextInput
                style={styles.input}
                value={newPrescription.sphLeft}
                onChangeText={(text) =>
                  setNewPrescription((prev) => ({ ...prev, sphLeft: text }))
                }
                placeholder="-1.25"
                placeholderTextColor={COLORS.grey14}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Typography
                title="SPH Right"
                fontSize={moderateScale(14)}
                color={COLORS.secondary}
                fontFamily="Inter-Medium"
                style={styles.label}
              />
              <TextInput
                style={styles.input}
                value={newPrescription.sphRight}
                onChangeText={(text) =>
                  setNewPrescription((prev) => ({ ...prev, sphRight: text }))
                }
                placeholder="-1.00"
                placeholderTextColor={COLORS.grey14}
                keyboardType="numeric"
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleAddPrescription}
            activeOpacity={0.8}
          >
            <Typography
              title="Save"
              fontSize={moderateScale(16)}
              color={COLORS.white}
              fontFamily="Inter-SemiBold"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = {
  addPrescriptionCard: {
    backgroundColor: COLORS.white,
    borderRadius: scale(12),
    padding: scale(16),
    marginHorizontal: scale(16),
    marginTop: verticalScale(16),
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    marginBottom: verticalScale(16),
  },
  formGroup: {
    marginBottom: verticalScale(12),
    flex: 1,
  },
  inputRow: {
    flexDirection: "row" as const,
    gap: scale(12),
  },
  label: {
    marginBottom: verticalScale(6),
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: scale(8),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(12),
    fontSize: moderateScale(16),
    color: COLORS.secondary,
    backgroundColor: COLORS.white,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: scale(8),
    paddingVertical: verticalScale(12),
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginTop: verticalScale(8),
  },
};

export default MyPrescriptions;
