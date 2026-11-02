import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store';
import {
  applyBuildPreset,
  BuildPreset,
  decrementStat,
  incrementStat,
  MIN_STAT,
  resetStats,
  StatKey,
} from '../store/slices/statsSlice';
import { colors, radius } from '../theme';

const STAT_ROWS: { key: StatKey; label: string; color: string }[] = [
  { key: 'str', label: '💪 Fuerza (STR)', color: colors.red },
  { key: 'agi', label: '⚡ Agilidad (AGI)', color: colors.green },
  { key: 'int', label: '📖 Inteligencia (INT)', color: colors.blue },
];

const PRESETS: { key: BuildPreset; label: string }[] = [
  { key: 'WARRIOR', label: 'Build Guerrero' },
  { key: 'MAGE', label: 'Build Mago' },
  { key: 'ROGUE', label: 'Build Pícaro' },
];

const LEVEL_BAR_MAX = 20;

// Zona B: solo despacha acciones a statsSlice y lee sus propios valores base.
export function StatsControlPanel() {
  const dispatch = useAppDispatch();
  const stats = useAppSelector((s) => s.stats);

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Panel de Entrenamiento</Text>
        <View style={styles.points}>
          <Text style={styles.pointsText}>{stats.availablePoints} pts</Text>
        </View>
      </View>

      {STAT_ROWS.map(({ key, label, color }) => (
        <View key={key} style={styles.row}>
          <View style={styles.rowInfo}>
            <Text style={styles.rowLabel}>{label}</Text>
            <View style={styles.levelTrack}>
              <View
                style={[
                  styles.levelFill,
                  { backgroundColor: color, width: `${Math.min(100, (stats[key] / LEVEL_BAR_MAX) * 100)}%` },
                ]}
              />
            </View>
          </View>
          <RoundButton
            label="−"
            disabled={stats[key] <= MIN_STAT}
            onPress={() => dispatch(decrementStat(key))}
          />
          <Text style={styles.value}>{stats[key]}</Text>
          <RoundButton
            label="+"
            disabled={stats.availablePoints <= 0}
            onPress={() => dispatch(incrementStat(key))}
          />
        </View>
      ))}

      <View style={styles.presets}>
        {PRESETS.map(({ key, label }) => (
          <Pressable
            key={key}
            style={({ pressed }) => [styles.presetBtn, pressed && styles.pressed]}
            onPress={() => dispatch(applyBuildPreset(key))}
          >
            <Text style={styles.presetText}>{label}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable
        style={({ pressed }) => [styles.resetBtn, pressed && styles.pressed]}
        onPress={() => dispatch(resetStats())}
      >
        <Text style={styles.resetText}>🧪 Poción de Reseteo</Text>
      </Pressable>
    </View>
  );
}

function RoundButton({ label, disabled, onPress }: { label: string; disabled: boolean; onPress: () => void }) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.roundBtn, disabled && styles.disabled, pressed && styles.pressed]}
    >
      <Text style={styles.roundText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { color: colors.text, fontSize: 16, fontWeight: '800' },
  points: { backgroundColor: colors.gold, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  pointsText: { color: '#0b1020', fontWeight: '800', fontSize: 13 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  rowInfo: { flex: 1 },
  rowLabel: { color: colors.text, fontSize: 12, fontWeight: '600', marginBottom: 4 },
  levelTrack: { height: 6, borderRadius: 3, backgroundColor: colors.border, overflow: 'hidden' },
  levelFill: { height: 6, borderRadius: 3 },
  value: { color: colors.text, fontSize: 18, fontWeight: '800', width: 28, textAlign: 'center' },
  roundBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundText: { color: colors.text, fontSize: 20, fontWeight: '700', lineHeight: 22 },
  disabled: { opacity: 0.35 },
  pressed: { opacity: 0.7 },
  presets: { flexDirection: 'row', gap: 8, marginTop: 4 },
  presetBtn: {
    flex: 1,
    backgroundColor: colors.purple,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  presetText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  resetBtn: {
    marginTop: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 10,
    alignItems: 'center',
  },
  resetText: { color: colors.muted, fontWeight: '700', fontSize: 13 },
});
