import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store';
import { selectIsOverencumbered, selectTotalWeight, selectMaxCapacity } from '../store/selectors';
import { clearEquipment, Item, toggleEquipItem } from '../store/slices/inventorySlice';
import { colors, radius } from '../theme';

const bonusText = (item: Item) =>
  [
    item.bonusStr !== 0 && `${item.bonusStr > 0 ? '+' : ''}${item.bonusStr} STR`,
    item.bonusAgi !== 0 && `${item.bonusAgi > 0 ? '+' : ''}${item.bonusAgi} AGI`,
    item.bonusInt !== 0 && `${item.bonusInt > 0 ? '+' : ''}${item.bonusInt} INT`,
  ]
    .filter(Boolean)
    .join('  ');

// Zona C: despacha a inventorySlice; el log se alimenta solo vía extraReducers.
export function ArmoryGrid() {
  const dispatch = useAppDispatch();
  const catalog = useAppSelector((s) => s.inventory.catalog);
  const equippedIds = useAppSelector((s) => s.inventory.equippedIds);
  const overloaded = useAppSelector(selectIsOverencumbered);
  const weight = useAppSelector(selectTotalWeight);
  const capacity = useAppSelector(selectMaxCapacity);

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Armería & Mochila</Text>
        <Pressable onPress={() => dispatch(clearEquipment())}>
          <Text style={styles.clear}>Desequipar todo</Text>
        </Pressable>
      </View>

      {overloaded ? (
        <View style={styles.alert}>
          <Text style={styles.alertText}>
            ⚠️ ¡SOBRECARGADO! (-50% Velocidad) · {weight}/{capacity} kg
          </Text>
        </View>
      ) : null}

      <View style={styles.grid}>
        {catalog.map((item) => {
          const equipped = equippedIds.includes(item.id);
          return (
            <Pressable
              key={item.id}
              onPress={() => dispatch(toggleEquipItem(item.id))}
              style={({ pressed }) => [
                styles.item,
                equipped && styles.itemEquipped,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.icon}>{item.icon}</Text>
              <Text style={styles.name} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.bonus}>{bonusText(item)}</Text>
              <Text style={styles.weight}>⚖️ {item.weight} kg</Text>
              {equipped ? <Text style={styles.tag}>EQUIPADO</Text> : null}
            </Pressable>
          );
        })}
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
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { color: colors.text, fontSize: 16, fontWeight: '800' },
  clear: { color: colors.muted, fontSize: 12, fontWeight: '700' },
  alert: {
    backgroundColor: colors.red,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  alertText: { color: '#fff', fontWeight: '800', fontSize: 12, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  item: {
    width: '48.5%',
    backgroundColor: colors.cardAlt,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    padding: 10,
    alignItems: 'center',
  },
  itemEquipped: {
    borderColor: colors.gold,
    shadowColor: colors.gold,
    shadowOpacity: 0.9,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  pressed: { opacity: 0.75 },
  icon: { fontSize: 30 },
  name: { color: colors.text, fontSize: 12, fontWeight: '700', marginTop: 4 },
  bonus: { color: colors.green, fontSize: 10, fontWeight: '700', marginTop: 2, textAlign: 'center' },
  weight: { color: colors.muted, fontSize: 11, marginTop: 2 },
  tag: { color: colors.gold, fontSize: 9, fontWeight: '800', marginTop: 4 },
});
