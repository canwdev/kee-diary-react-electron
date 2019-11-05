import {globalVars} from "./index"
import store from "./index"

// selectors
export const selectorSettings = state => state.settings
export const selectorUnlocked = state => state.unlocked
export const selectorCurrentGroupUuid = state => state.currentGroupUuid
export const selectorDbHasUnsavedChange = state => state.dbHasUnsavedChange

// getters
export const getSettings = ()=> store.getState().settings
export function getGlobalDB() {
  return globalVars.db
}
