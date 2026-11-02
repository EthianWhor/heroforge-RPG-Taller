import { createSlice, UnknownAction } from '@reduxjs/toolkit';
import { ITEM_CATALOG } from './inventorySlice';

export const MAX_LOG_ENTRIES = 20;

// Solo registramos acciones de los demás slices (nunca las propias, para evitar bucles).
const TRACKED_PREFIXES = ['stats/', 'inventory/', 'arena/'];

export interface LogEntry {
  id: number;
  type: string;
  payload: string;
}

export interface ActionLogState {
  entries: LogEntry[];
  nextId: number;
}

const initialState: ActionLogState = { entries: [], nextId: 1 };

const isTrackedAction = (action: UnknownAction) =>
  TRACKED_PREFIXES.some((prefix) => action.type.startsWith(prefix));

function formatPayload(payload: unknown): string {
  if (payload === undefined) return '—';
  if (typeof payload === 'string') {
    const item = ITEM_CATALOG.find((i) => i.id === payload);
    return `"${item ? item.name : payload}"`;
  }
  return JSON.stringify(payload);
}

const actionLogSlice = createSlice({
  name: 'actionLog',
  initialState,
  reducers: {
    clearLog(state) {
      state.entries = [];
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(isTrackedAction, (state, action) => {
      const { type, payload } = action as { type: string; payload?: unknown };
      const entry: LogEntry = { id: state.nextId, type, payload: formatPayload(payload) };
      state.nextId += 1;
      state.entries = [entry, ...state.entries].slice(0, MAX_LOG_ENTRIES);
    });
  },
});

export const { clearLog } = actionLogSlice.actions;
export default actionLogSlice.reducer;
