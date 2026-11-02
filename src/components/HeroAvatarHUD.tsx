import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useAppSelector } from '../store';
import {
  selectEquippedWeaponIcon,
  selectHeroAvatarEmoji,
  selectHeroVisualClass,
  selectHpRatio,
  selectIsDefeated,
  selectIsOverencumbered,
  selectManaPool,
  selectMaxCapacity,
  selectSpeed,
  selectTotalStats,
  selectTotalWeight,
  selectWeightRatio,
} from '../store/selectors';
import { MAX_HP } from '../store/slices/statsSlice';
import { colors, radius } from '../theme';
import { ProgressBar } from './ProgressBar';

const MAX_MANA_SCALE = 150;

// Zona A: no tiene botones ni props; solo lee el Store mediante selectores derivados.
export function HeroAvatarHUD() {
  const currentHp = useAppSelector((s) => s.stats.currentHp);
  const hpRatio = useAppSelector(selectHpRatio);
  const defeated = useAppSelector(selectIsDefeated);
  const total = useAppSelector(selectTotalStats);
  const visual = useAppSelector(selectHeroVisualClass);
  const emoji = useAppSelector(selectHeroAvatarEmoji);
  const weaponIcon = useAppSelector(selectEquippedWeaponIcon);
  const weight = useAppSelector(selectTotalWeight);
  const capacity = useAppSelector(selectMaxCapacity);
  const weightRatio = useAppSelector(selectWeightRatio);
  const overloaded = useAppSelector(selectIsOverencumbered);
  const mana = useAppSelector(selectManaPool);
  const speed = useAppSelector(selectSpeed);

  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const auraColor = defeated ? colors.muted : visual.auraColor;
  const weightColor = overloaded ? colors.red : weightRatio >= 0.7 ? colors.yellow : colors.green;
  const hpColor = hpRatio > 0.5 ? colors.green : hpRatio > 0.25 ? colors.yellow : colors.red;

  return (
    <View style={styles.card}>
      <View style={styles.avatarCol}>
        <Animated.View
          style={[
            styles.aura,
            {
              borderColor: auraColor,
              shadowColor: auraColor,
              transform: [{ scale: defeated ? 1 : pulse }],
            },
          ]}
        >
          <Text style={styles.emoji}>{emoji}</Text>
          {weaponIcon && !defeated ? <Text style={styles.weapon}>{weaponIcon}</Text> : null}
        </Animated.View>
        <View style={[styles.badge, { backgroundColor: auraColor }]}>
          <Text style={styles.badgeText}>{defeated ? 'Derrotado' : visual.label}</Text>
        </View>
      </View>

      <View style={styles.barsCol}>
        <ProgressBar label="❤️ Vida (HP)" valueText={`${currentHp}/${MAX_HP}`} ratio={hpRatio} color={hpColor} />
        <ProgressBar
          label="🔮 Maná"
          valueText={`${mana} MP`}
          ratio={mana / MAX_MANA_SCALE}
          color={colors.blue}
        />
        <ProgressBar
          label={overloaded ? '🎒 Carga ¡SOBRECARGA!' : '🎒 Carga'}
          valueText={`${weight}/${capacity} kg`}
          ratio={weightRatio}
          color={weightColor}
        />
        <Text style={styles.statsLine}>
          STR {total.str} · AGI {total.agi} · INT {total.int} · VEL {speed}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    gap: 12,
  },
  avatarCol: { alignItems: 'center', width: 104 },
  aura: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 3,
    backgroundColor: colors.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.9,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  emoji: { fontSize: 42 },
  weapon: { position: 'absolute', right: -8, bottom: -4, fontSize: 26 },
  badge: { marginTop: 8, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  badgeText: { color: '#0b1020', fontSize: 10, fontWeight: '800', textAlign: 'center' },
  barsCol: { flex: 1, justifyContent: 'center' },
  statsLine: { color: colors.muted, fontSize: 11, marginTop: 2 },
});
