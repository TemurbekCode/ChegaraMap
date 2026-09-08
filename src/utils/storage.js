const SAVE_KEY = "chegara_measurements";

function safeGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeSet(key, val) {
  try {
    localStorage.setItem(key, val);
    return true;
  } catch {
    return false;
  }
}

export function loadSavedMeasurements() {
  try {
    return JSON.parse(safeGet(SAVE_KEY)) || [];
  } catch {
    return [];
  }
}

export function persistSavedMeasurements(list) {
  return safeSet(SAVE_KEY, JSON.stringify(list));
}
