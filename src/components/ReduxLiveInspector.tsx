import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store';
import {
  selectBossHpRatio,
  selectCombatPower,
  selectIsBossDefeated,
  selectIsDefeated,
  selectRecentActions,
} from '../store/selectors';
import { clearLog } from '../store/slices/actionLogSlice';
import { BOSS_MAX_HP, BOSS_NAME, resetBoss } from '../store/slices/arenaSlice';
import { healHero } from '../store/slices/statsSlice';
import { attackBoss } from '../store/thunks';
import { colors, radius } from '../theme';
import { ProgressBar } from './ProgressBar';

const MONO = Platform.select({ ios: 'Menlo', default: 'monospace' });

// Zona D: arena de combate + consola que muestra el flujo de acciones de Redux en vivo.
export function ReduxLiveInspector() {
  const dispatch = useAppDispatch();
  const power = useAppSelector(selectCombatPower);
  const bossHp = useAppSelector((s) => s.arena.bossHp);
  const bossRatio = useAppSelector(selectBossHpRatio);
  const bossDefeated = useAppSelector(selectIsBossDefeated);
  const heroDefeated = useAppSelector(selectIsDefeated);
  const heroHp = useAppSelector((s) => s.stats.currentHp);
  const actions = useAppSelector(selectRecentActions);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Arena de Simulación</Text>

      <View style={styles.bossRow}>
        <Text style={styles.bossEmoji}>{bossDefeated ? '☠️' : '🐉'}</Text>
        <View style={styles.bossBar}>
          <ProgressBar
            label={BOSS_NAME}
            valueText={`${bossHp}/${BOSS_MAX_HP}`}
            ratio={bossRatio}
            color={colors.purple}
            height={14}
          />
        </View>
      </View>

      <Text style={styles.power}>⚔️ Poder de combate actual: {power}</Text>
      {bossDefeated ? <Text style={styles.win}>🏆 ¡Jefe derrotado!</Text> : null}
      {heroDefeated ? <Text style={styles.lose}>💀 Has caído en combate</Text> : null}

      <View style={styles.buttons}>
        <Pressable
          disabled={heroDefeated || bossDefeated}
          onPress={() => dispatch(attackBoss())}
          style={({ pressed }) => [
            styles.btn,
            styles.attack,
            (heroDefeated || bossDefeated) && styles.disabled,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.btnText}>⚔️ Atacar al Jefe</Text>
        </Pressable>
        <Pressable
          disabled={heroHp >= 100}
          onPress={() => dispatch(healHero())}
          style={({ pressed }) => [
            styles.btn,
            styles.heal,
            heroHp >= 100 && styles.disabled,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.btnText}>💚 Curar</Text>
        </Pressable>
        <Pressable
          onPress={() => dispatch(resetBoss())}
          style={({ pressed }) => [styles.btn, styles.reset, pressed && styles.pressed]}
        >
          <Text style={styles.btnText}>🔁 Jefe</Text>
        </Pressable>
      </View>

      <View style={styles.console}>
        <View style={styles.consoleHeader}>
          <Text style={styles.consoleTitle}>▌REDUX INSPECTOR · últimas 5 acciones</Text>
          <Pressable onPress={() => dispatch(clearLog())}>
            <Text style={styles.consoleClear}>limpiar</Text>
          </Pressable>
        </View>
        {actions.length === 0 ? (
          <Text style={styles.empty}>Esperando acciones… toca algo en la app.</Text>
        ) : (
          actions.map((entry, index) => (
            <Text
              key={entry.id}
              style={[styles.line, { opacity: 1 - index * 0.15 }]}
              numberOfLines={1}
            >
              <Text style={styles.lineType}>[{entry.type}]</Text> → {entry.payload}
            </Text>
          ))
        )}
      </View>
    </View>
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
  title: { color: colors.text, fontSize: 16, fontWeight: '800', marginBottom: 10 },
  bossRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bossEmoji: { fontSize: 40 },
  bossBar: { flex: 1 },
  power: { color: colors.text, fontSize: 13, fontWeight: '700', marginVertical: 6 },
  win: { color: colors.gold, fontWeight: '800', marginBottom: 6 },
  lose: { color: colors.red, fontWeight: '800', marginBottom: 6 },
  buttons: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  btn: { borderRadius: 10, paddingVertical: 11, alignItems: 'center', paddingHorizontal: 10 },
  attack: { flex: 2, backgroundColor: colors.red },
  heal: { flex: 1, backgroundColor: colors.green },
  reset: { flex: 1, backgroundColor: colors.cardAlt, borderWidth: 1, borderColor: colors.border },
  btnText: { color: '#fff', fontWeight: '800', fontSize: 12 },
  disabled: { opacity: 0.35 },
  pressed: { opacity: 0.75 },
  console: { backgroundColor: '#05070f', borderRadius: 10, padding: 10, minHeight: 130 },
  consoleHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  consoleTitle: { color: colors.green, fontFamily: MONO, fontSize: 10, fontWeight: '700' },
  consoleClear: { color: colors.muted, fontFamily: MONO, fontSize: 10 },
  empty: { color: colors.muted, fontFamily: MONO, fontSize: 11 },
  line: { color: '#d1fae5', fontFamily: MONO, fontSize: 11, marginVertical: 2 },
  lineType: { color: colors.gold, fontWeight: '700' },
});
