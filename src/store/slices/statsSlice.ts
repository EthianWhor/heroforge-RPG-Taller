import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type StatKey = 'str' | 'agi' | 'int';
export type BuildPreset = 'WARRIOR' | 'MAGE' | 'ROGUE';

export const MAX_HP = 100;
export const INITIAL_POINTS = 15;
export const MIN_STAT = 1;

export interface StatsState {
  availablePoints: number;
  str: number;
  agi: number;
  int: number;
  currentHp: number;
}

const initialState: StatsState = {
  availablePoints: INITIAL_POINTS,
  str: 5,
  agi: 5,
  int: 5,
  currentHp: MAX_HP,
};

// Cada preset reparte los 15 puntos libres sobre la base 5/5/5 (total = 30).
const PRESETS: Record<BuildPreset, Record<StatKey, number>> = {
  WARRIOR: { str: 15, agi: 8, int: 7 },
  MAGE: { str: 7, agi: 8, int: 15 },
  ROGUE: { str: 8, agi: 15, int: 7 },
};

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    incrementStat(state, action: PayloadAction<StatKey>) {
      if (state.availablePoints <= 0) return;
      state.availablePoints -= 1;
      state[action.payload] += 1;
    },
    decrementStat(state, action: PayloadAction<StatKey>) {
      if (state[action.payload] <= MIN_STAT) return;
      state.availablePoints += 1;
      state[action.payload] -= 1;
    },
    takeDamage(state, action: PayloadAction<number>) {
      state.currentHp = Math.max(0, state.currentHp - Math.max(0, action.payload));
    },
    healHero(state) {
      state.currentHp = MAX_HP;
    },
    applyBuildPreset(state, action: PayloadAction<BuildPreset>) {
      Object.assign(state, PRESETS[action.payload], { availablePoints: 0 });
    },
    resetStats(state) {
      Object.assign(state, initialState, { currentHp: state.currentHp });
    },
  },
});

export const {
  incrementStat,
  decrementStat,
  takeDamage,
  healHero,
  applyBuildPreset,
  resetStats,
} = statsSlice.actions;
export default statsSlice.reducer;
