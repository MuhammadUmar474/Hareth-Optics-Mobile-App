import TimeSlotChip from "@/components/profile/time-slot-chip";
import Button from "@/components/ui/custom-button";
import CustomTextInput from "@/components/ui/custom-text-input";
import Typography from "@/components/ui/custom-typography";
import { Header } from "@/components/ui/header";
import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import React, { useMemo, useState } from "react";
import { FlatList, ScrollView, View } from "react-native";

const EyeTestAtHome: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const slots = useMemo(
    () => [
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "12:30",
      "13:00",
      "16:00",
      "16:30",
      "17:00",
    ],
    []
  );

  const handleSubmit = () => {
    // Placeholder for booking submission
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Header title="Eye Test at Home" />
      <ScrollView
        contentContainerStyle={{ padding: SIZES.padding, paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}
      >
        <Typography
          title="Book a home eye test"
          fontSize={SIZES.title}
          color={COLORS.secondary}
          style={{ fontWeight: "700" }}
        />
        <Typography
          title="A certified optometrist will visit you at your convenience."
          fontSize={SIZES.desc}
          color={COLORS.grayText}
          style={{ marginTop: 6 }}
        />

        <View style={{ marginTop: 16 }}>
          <CustomTextInput
            iconName="user"
            placeHolder="Full name"
            value={fullName}
            onChangeText={setFullName}
            height={48}
          />
        </View>

        <View style={{ marginTop: 12 }}>
          <CustomTextInput
            iconName="phone"
            placeHolder="Phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            height={48}
          />
        </View>

        <View style={{ marginTop: 12 }}>
          <CustomTextInput
            iconName="map-pin"
            placeHolder="Address"
            value={address}
            onChangeText={setAddress}
            multiline
          />
        </View>

        <View style={{ marginTop: 12 }}>
          <CustomTextInput
            iconName="calendar"
            placeHolder="Preferred date (YYYY-MM-DD)"
            value={date}
            onChangeText={setDate}
            height={48}
          />
        </View>

        <View style={{ marginTop: 16 }}>
          <Typography
            title="Select a time slot"
            fontSize={SIZES.body}
            color={COLORS.secondary}
            style={{ fontWeight: "700", marginBottom: 8 }}
          />
          <FlatList
            data={slots}
            keyExtractor={(t) => t}
            renderItem={({ item }) => (
              <TimeSlotChip
                label={item}
                selected={selectedSlot === item}
                onPress={() => setSelectedSlot(item)}
                style={{ marginRight: 8, marginBottom: 8 }}
              />
            )}
            numColumns={3}
            scrollEnabled={false}
          />
        </View>

        <View style={{ marginTop: 20 }}>
          <Button color="primary" shadow onPress={handleSubmit}>
            <Typography title="Book Appointment" color={COLORS.white} />
          </Button>
        </View>

        <View style={{ marginTop: 24 }}>
          <Typography
            title="Why choose Hareth Home Eye Test?"
            fontSize={SIZES.body}
            color={COLORS.secondary}
            style={{ fontWeight: "700", marginBottom: 8 }}
          />
          <View
            style={{
              backgroundColor: COLORS.white6,
              borderRadius: SIZES.radius,
              padding: 12,
            }}
          >
            <Typography
              title="• Professional optometrists"
              fontSize={SIZES.desc}
              color={COLORS.secondary}
            />
            <Typography
              title="• Latest portable equipment"
              fontSize={SIZES.desc}
              color={COLORS.secondary}
              style={{ marginTop: 4 }}
            />
            <Typography
              title="• Quick and hassle-free"
              fontSize={SIZES.desc}
              color={COLORS.secondary}
              style={{ marginTop: 4 }}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default EyeTestAtHome;
