// Simple localStorage-backed history for fiveD snapshots
const KEY = 'kundalini_five_d_history_v1';
const MAX_ENTRIES = 50;

export function addFiveDEntry(entry) {
  try {
    const list = getFiveDHistory();
    const next = [{ ...entry, timestamp: new Date().toISOString() }, ...list].slice(0, MAX_ENTRIES);
    localStorage.setItem(KEY, JSON.stringify(next));
    return true;
  } catch (e) {
    console.warn('Failed to save fiveD history', e);
    return false;
  }
}

export function getFiveDHistory() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to read fiveD history', e);
    return [];
  }
}
