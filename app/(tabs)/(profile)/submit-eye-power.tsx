import Button from "@/components/ui/custom-button";
import CustomTextInput from "@/components/ui/custom-text-input";
import Typography from "@/components/ui/custom-typography";
import { Header } from "@/components/ui/header";
import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import { useLocal } from "@/hooks/use-lang";
import React, { useCallback, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";

type EyeKey = "right" | "left";

interface EyePower {
  sph: string;
  cyl: string;
  axis: string;
  add: string;
}

interface Errors {
  right?: Partial<Record<keyof EyePower, string>>;
  left?: Partial<Record<keyof EyePower, string>>;
  pd?: string;
}

const initialEyeValues: EyePower = { sph: "", cyl: "", axis: "", add: "" };

const SubmitEyePower: React.FC = () => {
 const {t}=useLocal()
  const [eyes, setEyes] = useState<{ right: EyePower; left: EyePower }>({
    right: { ...initialEyeValues },
    left: { ...initialEyeValues },
  });
  const [pd, setPd] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});

  const hasCyl = useMemo(
    () => ({
      right: eyes.right.cyl.trim().length > 0,
      left: eyes.left.cyl.trim().length > 0,
    }),
    [eyes.right.cyl, eyes.left.cyl]
  );

  const onChangeEye = useCallback(
    (side: EyeKey, key: keyof EyePower, value: string) => {
      setEyes((prev) => ({
        ...prev,
        [side]: { ...prev[side], [key]: value },
      }));
    },
    []
  );

  const copyRightToLeft = useCallback(() => {
    setEyes((prev) => ({ ...prev, left: { ...prev.right } }));
  }, []);

  const showUploadStub = useCallback(() => {
    Alert.alert("Upload Prescription", "Coming soon");
  }, []);

  const parseNum = (v: string): number | null => {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const validate = useCallback((): boolean => {
    const next: Errors = {};

    const validateEye = (label: EyeKey, values: EyePower) => {
      const e: Partial<Record<keyof EyePower, string>> = {};
      const sph = parseNum(values.sph);
      if (sph === null || sph < -20 || sph > 20) {
        e.sph = "SPH must be between -20.00 and +20.00";
      }
      if (values.cyl.trim().length > 0) {
        const cyl = parseNum(values.cyl);
        if (cyl === null || cyl < -6 || cyl > 6) {
          e.cyl = "CYL must be between -6.00 and +6.00";
        }
      }
      if (values.cyl.trim().length > 0 || values.axis.trim().length > 0) {
        const axis = parseNum(values.axis);
        if (axis === null || axis < 0 || axis > 180) {
          e.axis = "AXIS must be 0–180";
        }
      }
      if (values.add.trim().length > 0) {
        const add = parseNum(values.add);
        if (add === null || add < 0 || add > 4) {
          e.add = "ADD must be between 0.00 and +4.00";
        }
      }
      if (Object.keys(e).length > 0) {
        (next as any)[label] = e;
      }
    };

    validateEye("right", eyes.right);
    validateEye("left", eyes.left);

    const pdNum = parseNum(pd);
    if (pdNum === null || pdNum < 50 || pdNum > 80) {
      next.pd = "PD must be between 50 and 80";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }, [eyes.left, eyes.right, pd]);

  const handleSubmit = useCallback(() => {
    if (!validate()) return;
    Alert.alert(
      "Submitted",
      "Your prescription has been submitted successfully."
    );
  }, [validate]);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Header title={t("profile.menu.submitEyePower")} />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* <View style={styles.card}>
          <Typography
            title="Upload prescription (image/pdf)"
            fontSize={SIZES.header}
            color={COLORS.secondary}
            style={{ marginBottom: SIZES.padding }}
          />
          <Button color="primary" onPress={showUploadStub} style={styles.buttonFull}>
            <Typography title="Upload " color={COLORS.white} />
          </Button>
        </View> */}

        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Typography
              title="Enter manually"
              fontSize={SIZES.header}
              color={COLORS.secondary}
            />
            <Button
              color="secondary"
              onPress={copyRightToLeft}
              style={styles.copyBtn}
            >
              <Typography title="Copy Right → Left" color={COLORS.white} />
            </Button>
          </View>

          <Typography title="Right eye (OD)" style={styles.sectionTitle} />
          <View style={styles.row}>
            <View style={styles.col}>
              <CustomTextInput
                label="SPH"
                placeHolder="e.g. -1.25"
                number
                value={eyes.right.sph}
                onChangeText={(t) => onChangeEye("right", "sph", t)}
                error={errors.right?.sph}
              />
            </View>
            <View style={styles.col}>
              <CustomTextInput
                label="CYL"
                placeHolder="e.g. -0.75"
                number
                value={eyes.right.cyl}
                onChangeText={(t) => onChangeEye("right", "cyl", t)}
                error={errors.right?.cyl}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <CustomTextInput
                label="AXIS"
                placeHolder={hasCyl.right ? "0–180" : "optional"}
                number
                value={eyes.right.axis}
                onChangeText={(t) => onChangeEye("right", "axis", t)}
                error={errors.right?.axis}
              />
            </View>
            <View style={styles.col}>
              <CustomTextInput
                label="ADD"
                placeHolder="e.g. +1.50"
                number
                value={eyes.right.add}
                onChangeText={(t) => onChangeEye("right", "add", t)}
                error={errors.right?.add}
              />
            </View>
          </View>

          <Typography title="Left eye (OS)" style={styles.sectionTitle} />
          <View style={styles.row}>
            <View style={styles.col}>
              <CustomTextInput
                label="SPH"
                placeHolder="e.g. -1.25"
                number
                value={eyes.left.sph}
                onChangeText={(t) => onChangeEye("left", "sph", t)}
                error={errors.left?.sph}
              />
            </View>
            <View style={styles.col}>
              <CustomTextInput
                label="CYL"
                placeHolder="e.g. -0.75"
                number
                value={eyes.left.cyl}
                onChangeText={(t) => onChangeEye("left", "cyl", t)}
                error={errors.left?.cyl}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <CustomTextInput
                label="AXIS"
                placeHolder={hasCyl.left ? "0–180" : "optional"}
                number
                value={eyes.left.axis}
                onChangeText={(t) => onChangeEye("left", "axis", t)}
                error={errors.left?.axis}
              />
            </View>
            <View style={styles.col}>
              <CustomTextInput
                label="ADD"
                placeHolder="e.g. +1.50"
                number
                value={eyes.left.add}
                onChangeText={(t) => onChangeEye("left", "add", t)}
                error={errors.left?.add}
              />
            </View>
          </View>

          <CustomTextInput
            label="PD (50–80)"
            placeHolder="e.g. 63"
            number
            value={pd}
            onChangeText={setPd}
            error={errors.pd}
            containerStyle={{ marginTop: SIZES.padding }}
          />

          <CustomTextInput
            label="Notes (optional)"
            placeHolder="Any special instructions"
            multiline
            height={120}
            value={notes}
            onChangeText={setNotes}
            containerStyle={{ marginTop: SIZES.padding }}
          />

          <Button
            color="primary"
            onPress={handleSubmit}
            style={[styles.buttonFull, { marginTop: SIZES.padding }]}
          >
            <Typography title="Submit" color={COLORS.white} />
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: SIZES.padding,
    paddingBottom: SIZES.padding * 8,
    gap: SIZES.padding,
  },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.gray,
    borderRadius: SIZES.padding * 0.75,
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SIZES.padding,
  },
  sectionTitle: {
    marginTop: SIZES.padding,
    marginBottom: SIZES.padding * 0.5,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    gap: SIZES.padding,
  },
  col: {
    flex: 1,
  },
  buttonFull: {
    width: "100%",
  },
  copyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 36,
    borderRadius: 8,
  },
});

export default SubmitEyePower;
