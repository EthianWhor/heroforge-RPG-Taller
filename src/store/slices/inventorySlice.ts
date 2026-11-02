import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ItemCategory = 'weapon' | 'armor' | 'accessory';

export interface Item {
  id: string;
  name: string;
  icon: string;
  category: ItemCategory;
  bonusStr: number;
  bonusAgi: number;
  bonusInt: number;
  weight: number;
}

export const ITEM_CATALOG: Item[] = [
  { id: 'fire-sword', name: 'Espada de Fuego', icon: '🗡️', category: 'weapon', bonusStr: 4, bonusAgi: 0, bonusInt: 1, weight: 12 },
  { id: 'titan-shield', name: 'Escudo de Titanio', icon: '🛡️', category: 'armor', bonusStr: 3, bonusAgi: -1, bonusInt: 0, weight: 18 },
  { id: 'arcane-staff', name: 'Báculo Arcano', icon: '🪄', category: 'weapon', bonusStr: 0, bonusAgi: 0, bonusInt: 6, weight: 6 },
  { id: 'elven-boots', name: 'Botas Élficas', icon: '🥾', category: 'accessory', bonusStr: 0, bonusAgi: 5, bonusInt: 0, weight: 3 },
  { id: 'cursed-armor', name: 'Armadura Maldita', icon: '🧥', category: 'armor', bonusStr: 6, bonusAgi: -2, bonusInt: 2, weight: 30 },
  { id: 'war-axe', name: 'Hacha de Guerra', icon: '🪓', category: 'weapon', bonusStr: 5, bonusAgi: -1, bonusInt: 0, weight: 15 },
  { id: 'sage-ring', name: 'Anillo del Sabio', icon: '💍', category: 'accessory', bonusStr: 0, bonusAgi: 0, bonusInt: 3, weight: 1 },
];

export interface InventoryState {
  catalog: Item[];
  equippedIds: string[];
}

const initialState: InventoryState = {
  catalog: ITEM_CATALOG,
  equippedIds: [],
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    toggleEquipItem(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (!state.catalog.some((item) => item.id === id)) return;
      const index = state.equippedIds.indexOf(id);
      if (index >= 0) {
        state.equippedIds.splice(index, 1);
      } else {
        state.equippedIds.push(id);
      }
    },
    clearEquipment(state) {
      state.equippedIds = [];
    },
  },
});

export const { toggleEquipItem, clearEquipment } = inventorySlice.actions;
export default inventorySlice.reducer;
