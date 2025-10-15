import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import Typography from "../ui/custom-typography";

interface HelpTopicCardProps {
  question: string;
  answer: string;
}

const HelpTopicCard: React.FC<HelpTopicCardProps> = ({
  question,
  answer,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={toggleExpanded}
    >
      <View style={styles.content}>
        <Ionicons 
          name={isExpanded ? "caret-down" : "caret-forward"} 
          size={moderateScale(16)} 
          color={COLORS.black} 
          style={styles.chevronIcon}
        />
        <Typography 
          title={question} 
          fontSize={moderateScale(16)} 
          color={COLORS.black}
          fontFamily="Inter-Regular"
          style={styles.questionText} 
        />
      </View>
      
      {isExpanded && (
        <View style={styles.answerContainer}>
          <Typography 
            title={answer} 
            fontSize={moderateScale(14)} 
            color={COLORS.grey8}
            fontFamily="Inter-Regular"
            style={styles.answerText} 
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default React.memo(HelpTopicCard);

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: scale(12),
    marginVertical: verticalScale(4),
    marginHorizontal: scale(4),
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(10),
  },
  chevronIcon: {
    marginRight: scale(12),
  },
  questionText: {
    flex: 1,
    lineHeight: verticalScale(22),
    fontWeight: "700",
  },
  answerContainer: {
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(16),
    paddingTop: verticalScale(8),
  },
  answerText: {
    lineHeight: verticalScale(20),
  },
});
