import type { AppThunk } from './index';
import { damageBoss } from './slices/arenaSlice';
import { takeDamage } from './slices/statsSlice';
import {
  selectBossHitDamage,
  selectCombatPower,
  selectIsBossDefeated,
  selectIsDefeated,
} from './selectors';

// El héroe golpea con su poder de combate; si el jefe sobrevive, contraataca.
export const attackBoss = (): AppThunk => (dispatch, getState) => {
  const before = getState();
  if (selectIsDefeated(before) || selectIsBossDefeated(before)) return;

  dispatch(damageBoss(selectCombatPower(before)));

  const after = getState();
  if (!selectIsBossDefeated(after)) {
    dispatch(takeDamage(selectBossHitDamage(after)));
  }
};
