import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const BOSS_NAME = 'Dragón de Ceniza';
export const BOSS_MAX_HP = 200;

export interface ArenaState {
  bossHp: number;
}

const initialState: ArenaState = { bossHp: BOSS_MAX_HP };

const arenaSlice = createSlice({
  name: 'arena',
  initialState,
  reducers: {
    damageBoss(state, action: PayloadAction<number>) {
      state.bossHp = Math.max(0, state.bossHp - Math.max(0, action.payload));
    },
    resetBoss(state) {
      state.bossHp = BOSS_MAX_HP;
    },
  },
});

export const { damageBoss, resetBoss } = arenaSlice.actions;
export default arenaSlice.reducer;
