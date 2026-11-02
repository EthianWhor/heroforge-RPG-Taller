import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './index';
import type { Item } from './slices/inventorySlice';
import { MAX_HP } from './slices/statsSlice';
import { BOSS_MAX_HP } from './slices/arenaSlice';

// Nada de lo calculado aquí se guarda en el state: todo es estado derivado.

const selectStats = (state: RootState) => state.stats;
const selectCatalog = (state: RootState) => state.inventory.catalog;
const selectEquippedIds = (state: RootState) => state.inventory.equippedIds;
const selectLogEntries = (state: RootState) => state.actionLog.entries;

const sumBy = (items: Item[], key: 'bonusStr' | 'bonusAgi' | 'bonusInt' | 'weight') =>
  items.reduce((acc, item) => acc + item[key], 0);

export const selectEquippedItems = createSelector(
  [selectCatalog, selectEquippedIds],
  (catalog, equippedIds) => catalog.filter((item) => equippedIds.includes(item.id)),
);

export const selectTotalStats = createSelector(
  [selectStats, selectEquippedItems],
  (stats, items) => ({
    str: Math.max(1, stats.str + sumBy(items, 'bonusStr')),
    agi: Math.max(1, stats.agi + sumBy(items, 'bonusAgi')),
    int: Math.max(1, stats.int + sumBy(items, 'bonusInt')),
  }),
);

export const selectTotalWeight = createSelector([selectEquippedItems], (items) =>
  sumBy(items, 'weight'),
);

export const selectMaxCapacity = createSelector(
  [selectTotalStats],
  (total) => 10 + total.str * 2,
);

export const selectIsOverencumbered = createSelector(
  [selectTotalWeight, selectMaxCapacity],
  (weight, capacity) => weight > capacity,
);

export const selectWeightRatio = createSelector(
  [selectTotalWeight, selectMaxCapacity],
  (weight, capacity) => weight / capacity,
);

// Sobrecargado: velocidad efectiva al 50 %.
export const selectSpeed = createSelector(
  [selectTotalStats, selectIsOverencumbered],
  (total, overloaded) => Math.round(overloaded ? total.agi * 0.5 : total.agi),
);

export const selectManaPool = createSelector([selectTotalStats], (total) => 20 + total.int * 5);

export const selectCombatPower = createSelector(
  [selectTotalStats, selectIsOverencumbered],
  (total, overloaded) => {
    const rawPower = total.str * 3 + total.agi * 2 + total.int * 3;
    return overloaded ? Math.round(rawPower * 0.7) : rawPower;
  },
);

export interface HeroVisualClass {
  label: string;
  emoji: string;
  auraColor: string;
}

export const selectHeroVisualClass = createSelector(
  [selectTotalStats, selectTotalWeight],
  (total, weight): HeroVisualClass => {
    if (total.int >= 15) return { label: 'Archimago Arcano', emoji: '🧙', auraColor: '#3b82f6' };
    if (total.agi >= 15) return { label: 'Asesino Sombrío', emoji: '🥷', auraColor: '#10b981' };
    if (total.str >= 12 && weight >= 30) {
      return { label: 'Tanque Pesado', emoji: '🛡️', auraColor: '#f59e0b' };
    }
    if (total.str >= 15) {
      return { label: 'Guerrero Berserker', emoji: '😡', auraColor: '#ef4444' };
    }
    return { label: 'Aldeano', emoji: '🧑‍🌾', auraColor: '#94a3b8' };
  },
);

export const selectIsDefeated = (state: RootState) => state.stats.currentHp <= 0;
export const selectHpRatio = (state: RootState) => state.stats.currentHp / MAX_HP;
export const selectBossHpRatio = (state: RootState) => state.arena.bossHp / BOSS_MAX_HP;
export const selectIsBossDefeated = (state: RootState) => state.arena.bossHp <= 0;

// Expresión del avatar: la clase manda cuando está sano; el daño la sobreescribe.
export const selectHeroAvatarEmoji = createSelector(
  [selectHeroVisualClass, selectStats],
  (visual, stats) => {
    if (stats.currentHp <= 0) return '💀';
    if (stats.currentHp < 35) return '🤕';
    return visual.emoji;
  },
);

export const selectEquippedWeaponIcon = createSelector(
  [selectEquippedItems],
  (items) => items.find((item) => item.category === 'weapon')?.icon ?? null,
);

// Daño que devuelve el jefe: la agilidad esquiva, la sobrecarga lo empeora.
export const selectBossHitDamage = createSelector(
  [selectTotalStats, selectIsOverencumbered],
  (total, overloaded) => Math.max(4, 18 - Math.floor(total.agi / 2) + (overloaded ? 6 : 0)),
);

export const selectRecentActions = createSelector([selectLogEntries], (entries) =>
  entries.slice(0, 5),
);
