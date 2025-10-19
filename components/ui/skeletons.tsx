import { COLORS } from '@/constants/colors'
import * as React from 'react'
import { StyleSheet } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated'
import { scale } from 'react-native-size-matters'

const duration = 1000

interface SkeletonProps {
  style?: any;
  [key: string]: any;
}

function Skeleton({ style, ...props }: SkeletonProps) {
  const sv = useSharedValue(1)

  React.useEffect(() => {
    sv.value = withRepeat(withSequence(withTiming(0.5, { duration }), withTiming(1, { duration })), -1)
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: sv.value,
  }))

  return (
    <Animated.View 
      style={[styles.skeleton, animatedStyle, style]} 
      {...props} 
    />
  )
}

const styles = StyleSheet.create({
  skeleton: {
    borderRadius: scale(6), // rounded-md equivalent
    backgroundColor: COLORS.grey4, // bg-secondary equivalent
  },
})

export { Skeleton }
