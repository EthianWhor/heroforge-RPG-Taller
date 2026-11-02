import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

interface Props {
  label: string;
  valueText: string;
  ratio: number;
  color: string;
  height?: number;
}

export function ProgressBar({ label, valueText, ratio, color, height = 10 }: Props) {
  const clamped = Math.min(1, Math.max(0, ratio));
  const anim = useRef(new Animated.Value(clamped)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: clamped, duration: 350, useNativeDriver: false }).start();
  }, [clamped, anim]);

  const width = anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{valueText}</Text>
      </View>
      <View style={[styles.track, { height, borderRadius: height / 2 }]}>
        <Animated.View
          style={{ width, height, borderRadius: height / 2, backgroundColor: color }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  label: { color: colors.muted, fontSize: 11, fontWeight: '600' },
  value: { color: colors.text, fontSize: 11, fontWeight: '700' },
  track: { backgroundColor: colors.border, overflow: 'hidden' },
});
