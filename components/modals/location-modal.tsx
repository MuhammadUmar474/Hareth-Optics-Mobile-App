import { COLORS } from "@/constants/colors";
import { styles } from "@/styles/modals/location-modal";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const LocationModal = ({
  isVisible,
  setIsVisible,
}: {
  isVisible: boolean;
  setIsVisible: any;
}) => {
  const [location, setLocation] = useState("Kuwait City");

  const handleApply = () => {
    setIsVisible(false);
  };

  const handleCancel = () => {
    setIsVisible(false);
  };

  const useCurrentLocation = () => {
    setLocation("Kuwait City");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.headerText}>Select Location</Text>
            </View>

            <View style={styles.content}>
              <Text style={styles.label}>City / Area</Text>

              <View style={styles.inputContainer}>
                <MaterialIcons
                  name="location-on"
                  size={20}
                  color={COLORS.red}
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Enter your location"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <TouchableOpacity
                onPress={useCurrentLocation}
                style={styles.currentLocationButton}
              >
                <Text style={styles.currentLocationText}>
                  Use my current location
                </Text>
              </TouchableOpacity>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancel}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={handleApply}
                  activeOpacity={0.7}
                >
                  <Text style={styles.applyButtonText}>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LocationModal;
